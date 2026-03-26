<?php

// app/Http/Controllers/SyncController.php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\StockAdjustment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SyncController extends Controller
{
    /**
     * GET /api/sync/pull?since=2024-01-01T00:00:00Z
     *
     * Returns all products and categories updated since the given timestamp.
     * Includes soft-deleted records so the client can remove them locally.
     *
     * Route (add to your api.php):
     *   Route::middleware(['tenant', 'auth:sanctum'])->group(function () {
     *       Route::get('/sync/pull',  [SyncController::class, 'pull']);
     *       Route::post('/sync/push', [SyncController::class, 'push']);
     *   });
     */
    public function pull(Request $request)
    {
        try {
            $user  = $request->user();
            $since = $request->input('since', '2000-01-01T00:00:00Z');

            // Parse since — accept ISO-8601 or any Carbon-compatible string
            try {
                $sinceDate = \Carbon\Carbon::parse($since)->toDateTimeString();
            } catch (\Throwable $e) {
                $sinceDate = '2000-01-01 00:00:00';
            }

            // Resolve the active business for this user
            $business = $user->businesses()
                ->wherePivot('is_active', true)
                ->first();

            if (!$business) {
                return response()->json([
                    'success'    => false,
                    'message'    => 'No active business found.',
                ], 404);
            }

            $businessId = $business->id;

            // ── Products (including soft-deleted) ──────────────────────────
            $products = Product::withTrashed()
                ->where('business_id', $businessId)
                ->where(function ($q) use ($sinceDate) {
                    $q->where('updated_at', '>=', $sinceDate)
                      ->orWhere('created_at', '>=', $sinceDate)
                      ->orWhere('deleted_at', '>=', $sinceDate);
                })
                ->with(['category:id,name', 'unit:id,name'])
                ->get()
                ->map(function ($p) {
                    return [
                        'uuid'              => $p->uuid ?? (string) $p->id,
                        'id'                => $p->id,
                        'name'              => $p->name,
                        'item_code'         => $p->item_code,
                        'barcode'           => $p->barcode,
                        'sku'               => $p->sku,
                        'hsn_code'          => $p->hsn_code,
                        'description'       => $p->description,
                        'sale_price'        => (float) $p->sale_price,
                        'mrp'               => (float) $p->mrp,
                        'purchase_price'    => (float) $p->purchase_price,
                        'wholesale_price'   => (float) ($p->wholesale_price ?? 0),
                        'stock_quantity'    => (int) $p->stock_quantity,
                        'unit'              => $p->unit?->name ?? 'PCS',
                        'tax_rate'          => $p->tax_rate,
                        'tax_type'          => $p->tax_type,
                        'category_id'       => $p->category_id,
                        'category'          => $p->category
                            ? ['id' => $p->category->id, 'name' => $p->category->name]
                            : null,
                        'min_stock_level'   => $p->min_stock_level,
                        'low_stock_enabled' => (bool) $p->low_stock_enabled,
                        'track_inventory'   => (bool) ($p->track_inventory ?? true),
                        'image'             => $p->image
                            ? asset('storage/' . $p->image)
                            : null,
                        'is_active'         => (bool) $p->is_active,
                        'deleted_at'        => $p->deleted_at?->toIso8601String(),
                        'created_at'        => $p->created_at?->toIso8601String(),
                        'updated_at'        => $p->updated_at?->toIso8601String(),
                    ];
                });

            // ── Categories (including soft-deleted) ────────────────────────
            $categories = Category::withTrashed()
                ->where('business_id', $businessId)
                ->where(function ($q) use ($sinceDate) {
                    $q->where('updated_at', '>=', $sinceDate)
                      ->orWhere('created_at', '>=', $sinceDate)
                      ->orWhere('deleted_at', '>=', $sinceDate);
                })
                ->get()
                ->map(fn($c) => [
                    'id'         => $c->id,
                    'name'       => $c->name,
                    'deleted_at' => $c->deleted_at?->toIso8601String(),
                    'updated_at' => $c->updated_at?->toIso8601String(),
                ]);

            return response()->json([
                'success'    => true,
                'server_time' => now()->toIso8601String(),
                'products'   => $products,
                'categories' => $categories,
            ]);
        } catch (\Throwable $e) {
            Log::error('[SyncController::pull] ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Sync pull failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * POST /api/sync/push
     *
     * Receives batched create/update/delete operations from the client.
     *
     * Body shape:
     * {
     *   "products":   [ { "uuid": "...", "action": "upsert"|"delete", ...fields } ],
     *   "categories": [ { "id": 0, "name": "...", "action": "upsert"|"delete" } ],
     *   "stock_adjustments": [ { "product_uuid": "...", "type": "add"|"reduce", "quantity": 5, ... } ]
     * }
     */
    public function push(Request $request)
    {
        try {
            $user = $request->user();

            $business = $user->businesses()
                ->wherePivot('is_active', true)
                ->first();

            if (!$business) {
                return response()->json([
                    'success' => false,
                    'message' => 'No active business found.',
                ], 404);
            }

            $businessId = $business->id;
            $results    = [
                'products'         => ['synced' => 0, 'errors' => []],
                'categories'       => ['synced' => 0, 'errors' => []],
                'stock_adjustments'=> ['synced' => 0, 'errors' => []],
            ];

            // ── Push Categories ────────────────────────────────────────────
            foreach ($request->input('categories', []) as $catData) {
                try {
                    $action = $catData['action'] ?? 'upsert';

                    if ($action === 'delete') {
                        Category::where('business_id', $businessId)
                            ->where('id', $catData['id'])
                            ->delete();
                    } else {
                        Category::updateOrCreate(
                            [
                                'business_id' => $businessId,
                                'name'        => $catData['name'],
                            ],
                            ['name' => $catData['name']]
                        );
                    }
                    $results['categories']['synced']++;
                } catch (\Throwable $e) {
                    $results['categories']['errors'][] = [
                        'data'    => $catData,
                        'message' => $e->getMessage(),
                    ];
                }
            }

            // ── Push Products ──────────────────────────────────────────────
            foreach ($request->input('products', []) as $productData) {
                try {
                    $uuid   = $productData['uuid'] ?? null;
                    $action = $productData['action'] ?? 'upsert';

                    if ($action === 'delete' && $uuid) {
                        Product::where('business_id', $businessId)
                            ->where(function ($q) use ($uuid) {
                                $q->where('uuid', $uuid)
                                  ->orWhere('id', $uuid);
                            })
                            ->delete();
                    } else {
                        // Resolve category
                        $categoryId = null;
                        if (!empty($productData['category_name'])) {
                            $cat = Category::firstOrCreate(
                                [
                                    'business_id' => $businessId,
                                    'name'        => $productData['category_name'],
                                ],
                                ['name' => $productData['category_name']]
                            );
                            $categoryId = $cat->id;
                        } elseif (!empty($productData['category_id'])) {
                            $categoryId = $productData['category_id'];
                        }

                        $payload = array_filter([
                            'business_id'      => $businessId,
                            'name'             => $productData['name'] ?? null,
                            'item_code'        => $productData['item_code'] ?? $productData['code'] ?? null,
                            'barcode'          => $productData['barcode'] ?? null,
                            'sku'              => $productData['sku'] ?? null,
                            'hsn_code'         => $productData['hsn_code'] ?? null,
                            'description'      => $productData['description'] ?? null,
                            'sale_price'       => $productData['sale_price'] ?? 0,
                            'mrp'              => $productData['mrp'] ?? 0,
                            'purchase_price'   => $productData['purchase_price'] ?? 0,
                            'wholesale_price'  => $productData['wholesale_price'] ?? 0,
                            'stock_quantity'   => $productData['stock_quantity'] ?? $productData['stock_qty'] ?? 0,
                            'tax_rate'         => $productData['tax_rate'] ?? null,
                            'tax_type'         => $productData['tax_type'] ?? null,
                            'category_id'      => $categoryId,
                            'min_stock_level'  => $productData['min_stock_level'] ?? null,
                            'low_stock_enabled'=> (bool) ($productData['low_stock_enabled'] ?? false),
                            'track_inventory'  => (bool) ($productData['track_inventory'] ?? true),
                            'is_active'        => (bool) ($productData['is_active'] ?? true),
                        ], fn($v) => $v !== null);

                        if ($uuid) {
                            Product::withTrashed()
                                ->where('business_id', $businessId)
                                ->where(function ($q) use ($uuid) {
                                    $q->where('uuid', $uuid)
                                      ->orWhere('id', $uuid);
                                })
                                ->updateOrCreate(
                                    ['uuid' => $uuid, 'business_id' => $businessId],
                                    $payload
                                );
                        } else {
                            Product::create($payload);
                        }
                    }
                    $results['products']['synced']++;
                } catch (\Throwable $e) {
                    $results['products']['errors'][] = [
                        'uuid'    => $productData['uuid'] ?? null,
                        'message' => $e->getMessage(),
                    ];
                }
            }

            // ── Push Stock Adjustments ─────────────────────────────────────
            foreach ($request->input('stock_adjustments', []) as $adj) {
                try {
                    $productUuid = $adj['product_uuid'] ?? null;
                    if (!$productUuid) continue;

                    $product = Product::where('business_id', $businessId)
                        ->where(function ($q) use ($productUuid) {
                            $q->where('uuid', $productUuid)
                              ->orWhere('id', $productUuid);
                        })
                        ->first();

                    if (!$product) continue;

                    $qty  = (float) ($adj['quantity'] ?? 0);
                    $type = $adj['type'] ?? 'add';

                    if ($type === 'add') {
                        $product->increment('stock_quantity', $qty);
                    } elseif ($type === 'reduce') {
                        $product->decrement('stock_quantity', $qty);
                    } elseif ($type === 'set') {
                        $product->update(['stock_quantity' => $qty]);
                    }

                    // Optionally record adjustment history
                    if (class_exists(StockAdjustment::class)) {
                        StockAdjustment::create([
                            'product_id'  => $product->id,
                            'business_id' => $businessId,
                            'type'        => $type,
                            'quantity'    => $qty,
                            'note'        => $adj['note'] ?? null,
                            'date'        => $adj['date'] ?? now()->toDateString(),
                            'user_id'     => $user->id,
                        ]);
                    }

                    $results['stock_adjustments']['synced']++;
                } catch (\Throwable $e) {
                    $results['stock_adjustments']['errors'][] = [
                        'product_uuid' => $adj['product_uuid'] ?? null,
                        'message'      => $e->getMessage(),
                    ];
                }
            }

            return response()->json([
                'success'     => true,
                'server_time' => now()->toIso8601String(),
                'results'     => $results,
            ]);
        } catch (\Throwable $e) {
            Log::error('[SyncController::push] ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Sync push failed: ' . $e->getMessage(),
            ], 500);
        }
    }
}