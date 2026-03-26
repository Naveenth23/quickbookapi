<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StockAdjustment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class StockAdjustmentController extends Controller
{
    public function store(Request $request, string $uuid)
    {
        $request->validate([
            'type'     => 'required|in:add,reduce',
            'quantity' => 'required|integer|min:1',
            'date'     => 'required|date',
            'remarks'  => 'nullable|string|max:500',
        ]);

        $product = Product::where('uuid', $uuid)
            ->firstOrFail();

        $qty = (int) $request->quantity;

        if ($request->type === 'reduce' && $qty > $product->stock_quantity) {
            return response()->json([
                'message' => "Cannot reduce more than current stock ({$product->stock_quantity}).",
            ], 422);
        }

        $before = $product->stock_quantity;

        $product->stock_quantity = $request->type === 'add'
            ? $product->stock_quantity + $qty
            : $product->stock_quantity - $qty;

        $product->save();

        StockAdjustment::create([
            'product_id'   => $product->id,
            'business_id'  => $product->business_id,
            'type'         => $request->type,
            'quantity'     => $qty,
            'stock_before' => $before,
            'stock_after'  => $product->stock_quantity,
            'date'         => $request->date,
            'remarks'      => $request->remarks,
            'created_by'   => Auth::id(),
        ]);

        return response()->json([
            'message' => 'Stock adjusted successfully.',
            'data'    => ['stock_quantity' => $product->stock_quantity],
        ]);
    }

    public function history(Request $request, string $uuid)
    {
        $product = Product::where('uuid', $uuid)
            ->firstOrFail();

        $from    = $request->query('from');
        $to      = $request->query('to');
        $perPage = min((int) $request->query('per_page', 15), 9999);
        $page    = max((int) $request->query('page', 1), 1);

        // ── 1. Manual adjustments ────────────────────────────────
        $adjQuery = StockAdjustment::where('product_id', $product->id)
            ->select(
                'date',
                DB::raw("type"),                                        // raw 'add' / 'reduce'
                DB::raw("CASE WHEN type='add' THEN 'Add Stock' ELSE 'Reduce Stock' END as transaction_type"),
                'quantity',
                'stock_before',
                'stock_after',
                DB::raw("NULL as invoice_number"),
                DB::raw("NULL as invoice_uuid"),
                'remarks'
            );

        if ($from) $adjQuery->whereDate('date', '>=', $from);
        if ($to)   $adjQuery->whereDate('date', '<=', $to);

        $rows = $adjQuery->orderByDesc('date')->orderByDesc('id')->get()->toArray();

        // ── 2. Opening stock row ─────────────────────────────────
        $openingDate    = optional($product->created_at)->toDateString() ?? now()->toDateString();
        $includeOpening = (!$from || $openingDate >= $from) && (!$to || $openingDate <= $to);

        if ($includeOpening) {
            $rows[] = [
                'date'             => $openingDate,
                'type'             => 'opening',
                'transaction_type' => 'Opening Stock',
                'quantity'         => $product->opening_stock ?? $product->stock_quantity,
                'stock_before'     => 0,
                'stock_after'      => $product->opening_stock ?? $product->stock_quantity,
                'invoice_number'   => null,
                'invoice_uuid'     => null,
                'remarks'          => null,
            ];
        }

        // ── 3. Sales invoice lines (uncomment when ready) ────────
        // $salesRows = DB::table('invoice_items as ii')
        //     ->join('invoices as inv', 'inv.id', '=', 'ii.invoice_id')
        //     ->where('ii.product_id', $product->id)
        //     ->where('inv.business_id', $product->business_id)
        //     ->select(
        //         'inv.date',
        //         DB::raw("'sale' as type"),
        //         DB::raw("'Sales Invoice' as transaction_type"),
        //         'ii.quantity',
        //         DB::raw("NULL as stock_before"),
        //         DB::raw("NULL as stock_after"),
        //         'inv.invoice_number',
        //         'inv.uuid as invoice_uuid',
        //         DB::raw("NULL as remarks")
        //     )
        //     ->when($from, fn($q) => $q->whereDate('inv.date', '>=', $from))
        //     ->when($to,   fn($q) => $q->whereDate('inv.date', '<=', $to))
        //     ->get()->toArray();
        // $rows = array_merge($rows, $salesRows);

        // ── Sort all rows by date desc ───────────────────────────
        usort($rows, fn($a, $b) => strcmp(
            (string) ($b['date'] ?? ''),
            (string) ($a['date'] ?? '')
        ));

        // ── Paginate in PHP ──────────────────────────────────────
        $total      = count($rows);
        $lastPage   = (int) ceil($total / $perPage);
        $offset     = ($page - 1) * $perPage;
        $pageRows   = array_slice($rows, $offset, $perPage);

        return response()->json([
            'data' => $pageRows,
            'meta' => [
                'current_page' => $page,
                'last_page'    => max($lastPage, 1),
                'per_page'     => $perPage,
                'total'        => $total,
            ],
        ]);
    }
}