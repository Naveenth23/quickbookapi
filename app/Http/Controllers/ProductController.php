<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    private static function extractTaxRate($gstString)
    {
        if (empty($gstString) || $gstString === 'None') {
            return 0;
        }

        preg_match('/(\d+(\.\d+)?)/', $gstString, $matches);
        return isset($matches[1]) ? floatval($matches[1]) : 0;
    }

    // List Products (search supported)
    public function index(Request $request)
    {

        $query = Product::query();


        if ($search = $request->search) {
            $query->where('name', 'like', "%$search%");
        }

        return $query->latest()->paginate(10);
    }

    public function inventoryList(Request $request)
    {
        try {
            $query = \App\Models\Product::query();

            // Search by name or sku
            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('sku', 'like', "%{$search}%");
                });
            }

            // Category filter (skip 'all')
            if ($request->filled('category_id') && $request->category_id !== 'all') {
                $query->where('category_id', $request->category_id);
            }

            // Low stock filter (apply before paginate)
            // Accepts boolean true, 'true', 1, '1'
            if ($request->filled('low_stock') && filter_var($request->low_stock, FILTER_VALIDATE_BOOLEAN)) {
                // stock_quantity <= min_stock_level (use whereColumn to compare columns)
                $query->whereColumn('stock_quantity', '<=', 'min_stock_level');
            }

            // Sorting
            $query->orderBy('name');

            // Pagination parameters
            $perPage = max(1, (int) $request->input('per_page', 50));
            $page = max(1, (int) $request->input('page', 1));

            // Paginate the filtered query
            $paginated = $query->paginate($perPage, ['*'], 'page', $page);

            // Map items to safe payload
            $items = $paginated->getCollection()->map(function ($p) {
                return [
                    'id' => $p->id,
                    'uuid' => $p->uuid,
                    'name' => $p->name,
                    'sku' => $p->sku ?? null,
                    'stock_quantity' => (int) ($p->stock_quantity ?? 0),
                    'sale_price' => (float) ($p->sale_price ?? 0),
                    'purchase_price' => (float) ($p->purchase_price ?? 0),
                    'min_stock_level' => (int) ($p->min_stock_level ?? 5),
                    // add any other needed fields
                ];
            });

            // Replace collection with mapped items
            $paginated->setCollection($items);

            $stockValueFiltered = $query->get()->sum(function ($p) {
                return ((float) ($p->stock_quantity ?? 0)) * ((float) ($p->purchase_price ?? 0));
            });
            $lowStockCountFiltered = $query->get()->filter(function ($p) {
                return (int) ($p->stock_quantity ?? 0) <= (int) ($p->min_stock_level ?? 5);
            })->count();


            return response()->json([
                'success' => true,
                'stock_value' => (float) $stockValueFiltered,
                'low_stock' => (int) $lowStockCountFiltered,
                'products' => $paginated->items(),
                'meta' => [
                    'current_page' => $paginated->currentPage(),
                    'last_page' => $paginated->lastPage(),
                    'per_page' => $paginated->perPage(),
                    'total' => $paginated->total(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch inventory: ' . $e->getMessage(),
            ], 500);
        }
    }

    // Create
    // public function store(Request $request)
    // {
    //     $validated = $request->validate([
    //         'item_type' => 'required|string|in:product,service',
    //         'category_id' => 'nullable|exists:categories,id',
    //         'name' => 'required|string|max:255',
    //         'sale_price' => 'nullable|numeric|min:0',
    //         'purchase_price' => 'nullable|numeric|min:0',
    //         'gst_rate' => 'nullable|string|max:20',
    //         'hsn_code' => 'nullable|string|max:20',
    //         'unit' => 'nullable|string|max:50',
    //         'opening_stock' => 'nullable|numeric|min:0',
    //         'as_of_date' => 'nullable|date',
    //         'low_stock_enabled' => 'nullable|boolean',
    //         'low_stock_qty' => 'nullable|numeric|min:0',
    //         'description' => 'nullable|string',
    //         'item_code' => ['nullable', 'string', Rule::unique('products', 'sku')],
    //         'tax_included' => 'nullable|string|in:with_tax,without_tax',
    //     ]);

    //     $user = $request->user();

    //     $business = $user->businesses()->wherePivot('is_active', true)->first();

    //     // 🧩 Map frontend fields to your DB columns
    //     $productData = [
    //         'name' => $validated['name'],
    //         'sku' => $validated['item_code'] ?? strtoupper(Str::random(8)),
    //         'barcode' => $validated['item_code'] ?? random_int(100000000000, 999999999999),
    //         'hsn_code' => $validated['hsn_code'] ?? null,
    //         'description' => $validated['description'] ?? null,
    //         'sale_price' => $validated['sale_price'] ?? 0,
    //         'purchase_price' => $validated['purchase_price'] ?? 0,
    //         'stock_quantity' => $validated['opening_stock'] ?? 0,
    //         'as_of_date' => $validated['as_of_date'] ?? now(),
    //         'min_stock_level' => $validated['low_stock_qty'] ?? 5,
    //         'low_stock_enabled' => $validated['low_stock_enabled'] ?? false,
    //         'tax_rate' => self::extractTaxRate($validated['gst_rate']),
    //         'tax_type' => 'gst',
    //         'business_id' => $business->id ?? 1,
    //         'category_id' => $validated['category_id'] ?? null,
    //         'discount_percent' => 0,
    //         'discount_type' => 'percentage',
    //     ];

    //     // 🧾 Handle Units (auto-create if not exist)
    //     if (!empty($validated['unit'])) {
    //         $unit = Unit::firstOrCreate(['name' => strtoupper($validated['unit'])]);
    //         $productData['unit_id'] = $unit->id;
    //     }

    //     // ✅ Create Product
    //     $product = Product::create($productData);

    //     return response()->json([
    //         'success' => true,
    //         'message' => '✅ Product created successfully!',
    //         'data' => $product
    //     ]);
    // }

public function store(Request $request)
{
    $validated = $request->validate([
        'item_type'         => 'nullable|string|in:product,service',
        'category_id'       => 'nullable|exists:categories,id',
        'name'              => 'required|string|max:255',
        'sales_price'       => 'nullable|numeric|min:0',
        'sale_price'        => 'nullable|numeric|min:0',
        'purchase_price'    => 'nullable|numeric|min:0',
        'gst_rate'          => 'nullable|string|max:20',
        'tax_rate'          => 'nullable',
        'hsn_code'          => 'nullable|string|max:20',
        'unit'              => 'nullable|string|max:50',
        'unit_id'           => 'nullable|exists:units,id',
        'opening_stock'     => 'nullable|numeric|min:0',
        'stock_quantity'    => 'nullable|numeric|min:0',
        'as_of_date'        => 'nullable|date',
        'low_stock_enabled' => 'nullable',
        'low_stock_qty'     => 'nullable|numeric|min:0',
        'min_stock_level'   => 'nullable|numeric|min:0',
        'description'       => 'nullable|string',
        'item_code'         => 'nullable|string',
        'barcode'           => 'nullable|string',
        'tax_included'      => 'nullable|string|in:with_tax,without_tax',
        'tax_type'          => 'nullable|string',
        'image'             => 'nullable|string',
        'image_upload'      => 'nullable|image|max:5120',
    ]);
 
    $taxRate = 0;
    if (isset($validated['tax_rate'])) {
        $taxRate = (int) $validated['tax_rate'];
    } elseif (isset($validated['gst_rate'])) {
        $taxRate = self::extractTaxRate($validated['gst_rate']);
    }
 
    $itemCode = $validated['item_code'] ?? $validated['barcode'] ?? null;
    if ($itemCode) {
        $exists = Product::where('sku', $itemCode)->exists();
        $sku    = $exists ? strtoupper(\Illuminate\Support\Str::random(8)) : $itemCode;
    } else {
        $sku = strtoupper(\Illuminate\Support\Str::random(8));
    }
 
    $stock           = $validated['stock_quantity'] ?? $validated['opening_stock'] ?? 0;
    $minStock        = $validated['min_stock_level'] ?? $validated['low_stock_qty'] ?? 5;
    $lowStockEnabled = filter_var($validated['low_stock_enabled'] ?? false, FILTER_VALIDATE_BOOLEAN);
    $salePrice       = $validated['sales_price'] ?? $validated['sale_price'] ?? 0;
 
    $productData = [
        'name'              => $validated['name'],
        'item_type'         => $validated['item_type'] ?? 'product',
        'sku'               => $sku,
        'barcode'           => $itemCode ?? random_int(100000000000, 999999999999),
        'hsn_code'          => $validated['hsn_code'] ?? null,
        'description'       => $validated['description'] ?? null,
        'sale_price'        => $salePrice,
        'purchase_price'    => $validated['purchase_price'] ?? 0,
        'stock_quantity'    => $stock,
        'as_of_date'        => $validated['as_of_date'] ?? now()->toDateString(),
        'min_stock_level'   => $minStock,
        'low_stock_enabled' => $lowStockEnabled,
        'tax_rate'          => $taxRate,
        'tax_type'          => $validated['tax_type'] ?? 'gst',
        'tax_included'      => $validated['tax_included'] ?? 'without_tax',
        'category_id'       => $validated['category_id'] ?? null,
        'discount_percent'  => 0,
        'discount_type'     => 'percentage',
        'image'             => $validated['image'] ?? null,
    ];
 
    if (!empty($validated['unit_id'])) {
        $productData['unit_id'] = $validated['unit_id'];
    } elseif (!empty($validated['unit'])) {
        $unit = \App\Models\Unit::firstOrCreate(['name' => strtoupper($validated['unit'])]);
        $productData['unit_id'] = $unit->id;
    }
 
    // 🔥 business_id auto-attached by BelongsToBusiness trait
    $product = Product::create($productData);
 
    // Image file upload — forceFill bypasses $fillable
    if ($request->hasFile('image_upload')) {
        $path     = $request->file('image_upload')->store("products/{$product->id}", 'public');
        $imageUrl = \Storage::url($path);
        $product->forceFill(['image' => $imageUrl])->save();
    }
 
    return response()->json([
        'success' => true,
        'message' => 'Product created successfully!',
        'data'    => $product->refresh(),
    ]);
}
 
// ─────────────────────────────────────────────────────────────────────────────
 
public function update(Request $request, Product $product)
{
    $validated = $request->validate([
        'name'              => 'nullable|string|max:255',
        'item_type'         => 'nullable|string|in:product,service',
        'sales_price'       => 'nullable|numeric|min:0',
        'sale_price'        => 'nullable|numeric|min:0',
        'purchase_price'    => 'nullable|numeric|min:0',
        'stock_quantity'    => 'nullable|numeric|min:0',
        'category_id'       => 'nullable|exists:categories,id',
        'gst_rate'          => 'nullable|string|max:20',
        'tax_rate'          => 'nullable',
        'tax_type'          => 'nullable|string',
        'tax_included'      => 'nullable|string|in:with_tax,without_tax',
        'hsn_code'          => 'nullable|string|max:20',
        'unit'              => 'nullable|string|max:50',
        'unit_id'           => 'nullable|exists:units,id',
        'low_stock_enabled' => 'nullable',
        'low_stock_qty'     => 'nullable|numeric|min:0',
        'min_stock_level'   => 'nullable|numeric|min:0',
        'description'       => 'nullable|string',
        'barcode'           => 'nullable|string',
        'item_code'         => 'nullable|string',
        'as_of_date'        => 'nullable|date',
        'image'             => 'nullable|string',
        'image_upload'      => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
    ]);
 
    $updateData = [];
 
    foreach ([
        'name', 'description', 'as_of_date', 'tax_included',
        'tax_type', 'hsn_code', 'category_id', 'barcode', 'stock_quantity',
    ] as $field) {
        if (array_key_exists($field, $validated)) {
            $updateData[$field] = $validated[$field];
        }
    }
 
    $salePrice = $validated['sales_price'] ?? $validated['sale_price'] ?? null;
    if ($salePrice !== null) $updateData['sale_price'] = $salePrice;
 
    if (array_key_exists('purchase_price', $validated)) {
        $updateData['purchase_price'] = $validated['purchase_price'];
    }
 
    if (array_key_exists('tax_rate', $validated)) {
        $updateData['tax_rate'] = (int) $validated['tax_rate'];
    } elseif (array_key_exists('gst_rate', $validated)) {
        $updateData['tax_rate'] = self::extractTaxRate($validated['gst_rate']);
    }
 
    if (!empty($validated['unit_id'])) {
        $updateData['unit_id'] = $validated['unit_id'];
    } elseif (!empty($validated['unit'])) {
        $unit = \App\Models\Unit::firstOrCreate(['name' => strtoupper($validated['unit'])]);
        $updateData['unit_id'] = $unit->id;
    }
 
    if (array_key_exists('low_stock_enabled', $validated)) {
        $updateData['low_stock_enabled'] = filter_var(
            $validated['low_stock_enabled'], FILTER_VALIDATE_BOOLEAN
        );
    }
    $minStock = $validated['min_stock_level'] ?? $validated['low_stock_qty'] ?? null;
    if ($minStock !== null) $updateData['min_stock_level'] = $minStock;
 
    if (!empty($validated['image'])) $updateData['image'] = $validated['image'];
 
    // forceFill so nothing is silently blocked by $fillable
    $product->forceFill($updateData)->save();
 
    // Image file upload
    if ($request->hasFile('image_upload')) {
        if ($product->image && \Illuminate\Support\Str::startsWith($product->image, '/storage/')) {
            \Storage::delete(str_replace('/storage/', 'public/', $product->image));
        }
        $path     = $request->file('image_upload')->store("products/{$product->id}", 'public');
        $imageUrl = \Storage::url($path);
        $product->forceFill(['image' => $imageUrl])->save();
    }
 
    return response()->json([
        'success' => true,
        'data'    => $product->refresh(),
    ]);
}
 
// ─────────────────────────────────────────────────────────────────────────────
 
public function storeImage(Request $request, string $uuid)
{
    \Log::info('[storeImage] called', [
        'uuid'     => $uuid,
        'has_file' => $request->hasFile('image'),
        'keys'     => array_keys($request->all()),
    ]);
 
    $request->validate([
        'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
    ]);
 
    $product = Product::where('uuid', $uuid)
        ->orWhere('id', $uuid)
        ->firstOrFail();
 
    // Remove old locally-stored image
    if ($product->image && \Illuminate\Support\Str::startsWith($product->image, '/storage/')) {
        \Storage::delete(str_replace('/storage/', 'public/', $product->image));
    }
 
    $path     = $request->file('image')->store("products/{$product->id}", 'public');
    $imageUrl = \Storage::url($path);
 
    // forceFill guarantees the save regardless of $fillable config
    $product->forceFill(['image' => $imageUrl])->save();
 
    \Log::info('[storeImage] saved', [
        'image_url' => $imageUrl,
        'in_db'     => $product->refresh()->image,
    ]);
 
    return response()->json([
        'success'   => true,
        'image_url' => url($imageUrl),
        'data'      => $product->refresh(),
    ]);
}

    // View
    public function show(Product $product)
    {
        return response()->json([
            'success' => true,
            'data' => $product
        ]);
    }

    // Delete
    public function destroy($id)
    {
        Product::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }

    public function importFromGoogleSheet(Request $request)
    {
        $sheetId = '1U2DtnEx2uvmToG8L0nC219EQGvH8BuWqPk9JyferatI';
        $apiKey = env('GOOGLE_SHEETS_API_KEY');
        $range = 'bulk_upload!A3:G'; // your sheet tab and range

        $url = "https://sheets.googleapis.com/v4/spreadsheets/{$sheetId}/values/{$range}?key={$apiKey}";

        $response = Http::get($url);
        if ($response->failed()) {
            return response()->json(['success' => false, 'message' => 'Unable to fetch sheet data']);
        }

        $values = $response->json()['values'] ?? [];

        foreach ($values as $row) {
            if (empty($row[0])) continue; // Skip empty rows

            \App\Models\Product::updateOrCreate(
                ['sku' => $row[6] ?? null],
                [
                    'name' => $row[0],
                    'description' => $row[1] ?? '',
                    'category_id' => null,
                    'unit_id' => null,
                    'business_id' => auth()->user()->business_id ?? 1,
                    'barcode' => $row[6] ?? null,
                    'attributes' => [
                        'unit' => $row[3] ?? null,
                        'alt_unit' => $row[4] ?? null,
                        'conversion_rate' => $row[5] ?? null,
                    ],
                ]
            );
        }

        return response()->json(['success' => true, 'message' => '✅ Google Sheet data imported successfully!']);
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:products,id'
        ]);

        Product::whereIn('id', $request->ids)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Products deleted successfully'
        ]);
    }
}
