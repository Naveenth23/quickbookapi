<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class StockSummaryController extends Controller
{
    /**
     * GET /api/reports/stock-summary
     *
     * Returns:
     *   - total_stock_value
     *   - total_items
     *   - low_stock_count
     *   - out_of_stock_count
     *   - paginated list of stock items with qty, unit, value
     *   - filterable by category_id
     */
    public function index(Request $request): JsonResponse
    {
        $businessId = $request->user()->currentBusiness()->id
            ?? $request->user()->businesses()->first()?->id;

        if (!$businessId) {
            return response()->json(['success' => false, 'message' => 'No business found'], 404);
        }

        $categoryId = $request->query('category_id');
        $search     = $request->query('search', '');
        $perPage    = (int) $request->query('per_page', 50);

        // ── Base query ────────────────────────────────────────────────────
        $query = Product::with(['unit', 'category'])
            ->where('is_active', true)
            ->where('track_inventory', true);

        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%")
                  ->orWhere('hsn_code', 'like', "%{$search}%");
            });
        }

        // ── Aggregate totals (before pagination) ─────────────────────────
        $aggregates = (clone $query)
            ->selectRaw('
                SUM(stock_quantity * purchase_price)    AS total_stock_value,
                COUNT(*)                                AS total_items,
                SUM(CASE WHEN stock_quantity <= 0 THEN 1 ELSE 0 END)                       AS out_of_stock_count,
                SUM(CASE WHEN stock_quantity > 0 AND stock_quantity <= min_stock_level THEN 1 ELSE 0 END) AS low_stock_count
            ')
            ->first();

        // ── Paginated rows ────────────────────────────────────────────────
        $items = $query
            ->orderBy('name')
            ->paginate($perPage)
            ->through(fn ($p) => $this->formatProduct($p));

        // ── Categories for filter dropdown ────────────────────────────────
        $categories = Category::orderBy('name')
            ->get(['id', 'name']);

        return response()->json([
            'success' => true,
            'summary' => [
                'total_stock_value'  => round((float) ($aggregates->total_stock_value ?? 0), 2),
                'total_items'        => (int) ($aggregates->total_items ?? 0),
                'out_of_stock_count' => (int) ($aggregates->out_of_stock_count ?? 0),
                'low_stock_count'    => (int) ($aggregates->low_stock_count ?? 0),
            ],
            'categories' => $categories,
            'items'      => $items,
        ]);
    }

    /**
     * GET /api/reports/stock-summary/export?format=pdf|excel
     * Returns a download URL (handled separately by PDF/Excel jobs)
     */
    public function export(Request $request): JsonResponse
    {
        $format     = $request->query('format', 'pdf');
        $businessId = $request->user()->businesses()->first()?->id;
        $categoryId = $request->query('category_id');

        // You can queue a job here; for now return a signed URL placeholder
        $exportUrl = url("/api/reports/stock-summary/download?format={$format}&business_id={$businessId}&category_id={$categoryId}&token=" . csrf_token());

        return response()->json([
            'success'    => true,
            'export_url' => $exportUrl,
            'format'     => $format,
        ]);
    }

    // ── Private helpers ───────────────────────────────────────────────────

    private function formatProduct(Product $p): array
    {
        $qty        = (float) $p->stock_quantity;
        $unitName   = $p->unit?->name ?? 'PCS';
        $value      = round($qty * (float) $p->purchase_price, 2);
        $stockStatus = match(true) {
            $qty <= 0             => 'out_of_stock',
            $qty <= $p->min_stock_level => 'low_stock',
            default               => 'in_stock',
        };

        return [
            'id'           => $p->id,
            'uuid'         => $p->uuid ?? (string) $p->id,
            'name'         => $p->name,
            'sku'          => $p->sku,
            'hsn_code'     => $p->hsn_code,
            'category'     => $p->category?->name,
            'unit'         => $unitName,
            'stock_qty'    => $qty,
            'purchase_price' => (float) $p->purchase_price,
            'sale_price'   => (float) $p->sale_price,
            'stock_value'  => $value,
            'min_stock_level' => $p->min_stock_level,
            'stock_status' => $stockStatus,   // 'in_stock' | 'low_stock' | 'out_of_stock'
        ];
    }
}
