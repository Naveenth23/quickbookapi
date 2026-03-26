<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Product;
use App\Models\Customer;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::query()
            ->with(['customer'])
            ->where('order_type', $request->query('type', 'sale'));

        match ($request->query('date_filter', 'Last 365 Days')) {
            'Today'         => $query->whereDate('order_date', today()),
            'This Week'     => $query->whereBetween('order_date', [now()->startOfWeek(), now()->endOfWeek()]),
            'This Month'    => $query->whereMonth('order_date', now()->month)->whereYear('order_date', now()->year),
            'Last 30 Days'  => $query->whereDate('order_date', '>=', now()->subDays(30)),
            'Last 90 Days'  => $query->whereDate('order_date', '>=', now()->subDays(90)),
            'Last 365 Days' => $query->whereDate('order_date', '>=', now()->subDays(365)),
            default         => null,
        };

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('invoice_number', 'like', "%{$search}%")
                  ->orWhereHas('customer', fn($c) => $c->where('name', 'like', "%{$search}%"));
            });
        }

        $summary = [
            'total'  => (clone $query)->sum('total_amount'),
            'paid'   => (clone $query)->where('payment_status', 'paid')->sum('total_amount'),
            'unpaid' => (clone $query)->whereIn('payment_status', ['pending','partial','overdue'])->sum('total_amount'),
        ];

        $orders = $query->orderByDesc('order_date')
                        ->orderByDesc('id')
                        ->paginate((int) $request->query('per_page', 10));

        $data = $orders->getCollection()->map(fn($o) => [
            'uuid'           => $o->uuid,
            'order_number'   => $o->order_number,
            'invoice_number' => $o->invoice_number,
            'order_date'     => $o->order_date,
            'due_date'       => $o->due_date,
            'customer_name'  => $o->customer?->name,
            'customer_phone' => $o->customer?->phone ?? $o->customer?->mobile,
            'total_amount'   => $o->total_amount,
            'paid_amount'    => $o->paid_amount,
            'balance_amount' => $o->balance_amount,
            'payment_status' => $o->payment_status,
            'status'         => $o->status,
        ]);

        return response()->json([
            'data'    => $data,
            'summary' => $summary,
            'meta'    => [
                'current_page' => $orders->currentPage(),
                'last_page'    => $orders->lastPage(),
                'per_page'     => $orders->perPage(),
                'total'        => $orders->total(),
            ],
        ]);
    }

    // public function store(Request $request)
    // {
    //     $validated = $request->validate([
    //         'items' => 'required|array|min:1',
    //         'items.*.name' => 'required|string|max:255',
    //         'items.*.quantity' => 'required|numeric|min:1',
    //         'items.*.sp' => 'required|numeric|min:0',
    //         'items.*.amount' => 'required|numeric|min:0',
    //         'items.*.unit' => 'nullable|string|max:50',
    //         'items.*.code' => 'nullable|string|max:50',
    //         'items.*.product_id' => 'nullable|integer|exists:products,id',
    //         'total' => 'required|numeric|min:0',
    //         'payment_method' => 'nullable|string|in:cash,card,upi,bank_transfer,cheque,credit',
    //     ]);

    //     DB::beginTransaction();

    //     try {
    //         $user = $request->user();

    //         $business = $user->businesses()
    //             ->wherePivot('is_active', true)
    //             ->first();

    //         if (!$business) {
    //             throw new \Exception('No active business found for this user.');
    //         }

    //         $orderNumber = 'ORD-' . now()->format('Ymd') . '-' . strtoupper(Str::random(5));
    //         $invoiceNumber = 'INV-' . now()->format('Ymd') . '-' . strtoupper(Str::random(5));

    //         $subtotal = $validated['total'];
    //         $grandTotal = $subtotal; // extend later for GST or discounts

    //         // Create Order
    //         $order = Order::create([
    //             'order_number' => $orderNumber,
    //             'invoice_number' => $invoiceNumber,
    //             'order_date' => now(),
    //             'order_type' => 'sale',
    //             'status' => 'confirmed',
    //             'payment_status' => 'paid',
    //             'payment_method' => $validated['payment_method'] ?? 'cash',
    //             'subtotal' => $subtotal,
    //             'tax_amount' => 0,
    //             'discount_amount' => 0,
    //             'total_amount' => $grandTotal,
    //             'paid_amount' => $grandTotal,
    //             'balance_amount' => 0,
    //             'business_id' => $business->id,
    //             'created_by' => $user->id ?? 1,
    //         ]);

    //         // Save Items and Deduct Stock
    //         foreach ($validated['items'] as $item) {
    //             $productId = $item['product_id'] ?? null;

    //             $orderItem = OrderItem::create([
    //                 'order_id' => $order->id,
    //                 'product_id' => $productId,
    //                 'item_type' => 'product',
    //                 'name' => $item['name'],
    //                 'sku' => $item['code'] ?? null,
    //                 'quantity' => $item['quantity'],
    //                 'unit' => $item['unit'] ?? 'PCS',
    //                 'unit_price' => $item['sp'],
    //                 'subtotal' => $item['amount'],
    //                 'total' => $item['amount'],
    //                 'taxable_amount' => 0,
    //                 'tax_amount' => 0,
    //                 'hsn_code' => $item['hsn_code'] ?? null,
    //             ]);

    //             // ✅ Reduce stock if product exists
    //             if ($productId) {
    //                 $product = \App\Models\Product::find($productId);
    //                 if ($product && $product->track_inventory) {
    //                     $newStock = max(0, $product->stock_quantity - $item['quantity']);
    //                     $product->update(['stock_quantity' => $newStock]);
    //                 }
    //             }
    //         }

    //         DB::commit();

    //         return response()->json([
    //             'success' => true,
    //             'message' => '✅ Bill saved & stock updated successfully!',
    //             'order' => $order->load('items')
    //         ]);
    //     } catch (\Exception $e) {
    //         DB::rollBack();
    //         return response()->json([
    //             'success' => false,
    //             'message' => '❌ Failed to save bill: ' . $e->getMessage()
    //         ], 500);
    //     }
    // }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            // items
            'items'                 => 'required|array|min:1',
            'items.*.name'          => 'required|string|max:255',
            'items.*.quantity'      => 'required|numeric|min:0.001',
            'items.*.sp'            => 'required|numeric|min:0',
            'items.*.amount'        => 'required|numeric|min:0',
            'items.*.unit'          => 'nullable|string|max:50',
            'items.*.code'          => 'nullable|string|max:100',
            'items.*.product_id'    => 'nullable|integer|exists:products,id',
            'items.*.hsn_code'      => 'nullable|string|max:20',
            // totals
            'sub_total'             => 'nullable|numeric|min:0',
            'tax'                   => 'nullable|numeric|min:0',
            'total'                 => 'required|numeric|min:0',
            'discount_amount'       => 'nullable|numeric|min:0',
            'extra_charges'         => 'nullable|array',
            'extra_charges.*.name'  => 'required_with:extra_charges|string',
            'extra_charges.*.amount'=> 'required_with:extra_charges|numeric|min:0',
            // payment
            'payment_method'        => 'nullable|string|in:cash,card,upi,bank_transfer,cheque,credit',
            'received_amount'       => 'nullable|numeric|min:0',
            // customer — one of three shapes:
            //   A) customer_id  (existing customer, selected from search)
            //   B) customer.name + customer.mobile  (quick cash sale / new walk-in)
            //   C) neither  →  Cash Sale
            'customer_id'           => 'nullable|integer|exists:customers,id',
            'customer'              => 'nullable|array',
            'customer.name'         => 'nullable|string|max:255',
            'customer.mobile'       => 'nullable|string|max:20',
            'customer.email'        => 'nullable|email|max:255',
            'customer.gstin'        => 'nullable|string|max:20',
            // notes
            'notes'                 => 'nullable|string|max:500',
        ]);

        DB::beginTransaction();
        try {
            $user     = $request->user();
            $business = app('currentBusiness');   // set by IdentifyTenant middleware

            /* ── 1. Resolve / create customer ── */
            $customerId = null;

            if (!empty($validated['customer_id'])) {
                // Existing customer selected from search
                $customerId = $validated['customer_id'];

            } elseif (!empty($validated['customer']['name']) && $validated['customer']['name'] !== 'Cash Sale') {
                $custData = $validated['customer'];

                // Try to match by phone if provided (avoid duplicates)
                $existing = null;
                if (!empty($custData['mobile'])) {
                    $existing = Customer::where('phone', $custData['mobile'])
                        ->first();
                }

                if ($existing) {
                    $customerId = $existing->id;
                } else {
                    // Create a new walk-in customer record
                    $newCust = Customer::create([
                        'business_id'      => $business->id,
                        'name'             => $custData['name'],
                        'phone'            => $custData['mobile'] ?? null,
                        'email'            => $custData['email']  ?? null,
                        'gstin'            => $custData['gstin']  ?? null,
                        'customer_type'    => 'walkin',
                        'is_active'        => true,
                        'customer_code'    => 'CUST-' . strtoupper(Str::random(6)),
                        'opening_balance'  => 0,
                        'current_balance'  => 0,
                    ]);
                    $customerId = $newCust->id;
                }
            }

            /* ── 2. Totals ── */
            $subTotal      = (float) ($validated['sub_total']       ?? $validated['total']);
            $taxAmount     = (float) ($validated['tax']             ?? 0);
            $discountAmount= (float) ($validated['discount_amount'] ?? 0);
            $grandTotal    = (float)  $validated['total'];
            $receivedAmt   = (float) ($validated['received_amount'] ?? $grandTotal);
            $balanceAmt    = max(0, $grandTotal - $receivedAmt);
            $paymentStatus = $balanceAmt <= 0 ? 'paid' : ($receivedAmt > 0 ? 'partial' : 'pending');

            /* ── 3. Create order ── */
            $order = Order::create([
                'order_number'    => 'ORD-' . now()->format('Ymd') . '-' . strtoupper(Str::random(5)),
                'invoice_number'  => 'INV-' . now()->format('Ymd') . '-' . strtoupper(Str::random(5)),
                'order_date'      => now()->toDateString(),
                'order_type'      => 'sale',
                'status'          => 'confirmed',
                'payment_status'  => $paymentStatus,
                'payment_method'  => $validated['payment_method'] ?? 'cash',
                'subtotal'        => $subTotal,
                'tax_amount'      => $taxAmount,
                'discount_amount' => $discountAmount,
                'total_amount'    => $grandTotal,
                'paid_amount'     => $receivedAmt,
                'balance_amount'  => $balanceAmt,
                'taxable_amount'  => $subTotal,
                'notes'           => $validated['notes'] ?? null,
                'business_id'     => $business->id,
                'customer_id'     => $customerId,
                'created_by'      => $user->id,
            ]);

            /* ── 4. Order items + stock deduction ── */
            foreach ($validated['items'] as $item) {
                OrderItem::create([
                    'order_id'       => $order->id,
                    'product_id'     => $item['product_id']   ?? null,
                    'item_type'      => 'product',
                    'name'           => $item['name'],
                    'sku'            => $item['code']          ?? null,
                    'hsn_code'       => $item['hsn_code']      ?? null,
                    'quantity'       => $item['quantity'],
                    'unit'           => $item['unit']          ?? 'PCS',
                    'unit_price'     => $item['sp'],
                    'subtotal'       => $item['amount'],
                    'total'          => $item['amount'],
                    'taxable_amount' => 0,
                    'tax_amount'     => 0,
                ]);

                if (!empty($item['product_id'])) {
                    $product = Product::find($item['product_id']);
                    if ($product && $product->track_inventory) {
                        $product->decrement('stock_quantity', $item['quantity']);
                    }
                }
            }

            /* ── 5. Update customer stats ── */
            if ($customerId) {
                Customer::where('id', $customerId)->update([
                    'total_purchases' => DB::raw("total_purchases + {$grandTotal}"),
                    'total_orders'    => DB::raw('total_orders + 1'),
                    'last_order_date' => now()->toDateString(),
                    // Deduct from current_balance if credit sale
                    'current_balance' => $paymentStatus !== 'paid'
                        ? DB::raw("current_balance + {$balanceAmt}")
                        : DB::raw('current_balance'),
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Bill saved successfully!',
                'order'   => $order->load(['items', 'customer']),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed: ' . $e->getMessage(),
            ], 500);
        }
    }
    /**
     * GET /api/orders/{uuid}
     *
     * HasUuid trait makes Laravel resolve the model by `uuid` column
     * automatically when you use Route Model Binding.
     * BelongsToBusiness global scope ensures cross-tenant access is blocked.
     *
     * Two options below — use whichever matches your setup:
     */

    // ── OPTION A: Route Model Binding (recommended if HasUuid sets getRouteKeyName)
    public function show(string $uuid)
    {
        // withoutGlobalScopes() is NOT used — BelongsToBusiness still protects this.
        // We just skip Route Model Binding and do the lookup manually.
        $order = Order::where('uuid', $uuid)->firstOrFail();

        $order->load(['items', 'customer', 'business']);

        // Load payments only if the relation exists on the model
        try {
            $order->load('payments');
        } catch (\Exception $e) {
            // payments relation not defined — skip silently
        }

        return $this->buildInvoiceResponse($order);
    }

    private function buildInvoiceResponse(Order $order): \Illuminate\Http\JsonResponse
    {
        $biz = $order->business;

        return response()->json([
            'data' => [
                'uuid'                 => $order->uuid,
                'order_number'         => $order->order_number,
                'invoice_number'       => $order->invoice_number,
                'reference_number'     => $order->reference_number,
                'order_date'           => $order->order_date,
                'due_date'             => $order->due_date,
                'order_type'           => $order->order_type,
                'status'               => $order->status,
                'payment_status'       => $order->payment_status,
                'payment_method'       => $order->payment_method,
                'subtotal'             => $order->subtotal,
                'tax_amount'           => $order->tax_amount,
                'taxable_amount'       => $order->taxable_amount,
                'discount_amount'      => $order->discount_amount,
                'shipping_amount'      => $order->shipping_amount,
                'round_off'            => $order->round_off,
                'total_amount'         => $order->total_amount,
                'paid_amount'          => $order->paid_amount,
                'balance_amount'       => $order->balance_amount,
                'cgst_amount'          => $order->cgst_amount,
                'sgst_amount'          => $order->sgst_amount,
                'igst_amount'          => $order->igst_amount,
                'cess_amount'          => $order->cess_amount,
                'notes'                => $order->notes,
                'terms_and_conditions' => $order->terms_and_conditions,
                'billing_address'      => $order->billing_address,
                'ewaybill_number'      => $order->ewaybill_number,

                'business' => $biz ? [
                    'name'    => $biz->name,
                    'mobile'  => $biz->mobile  ?? $biz->phone,
                    'email'   => $biz->email,
                    'address' => implode(', ', array_filter([
                        $biz->address,
                        $biz->city,
                        $biz->state,
                        $biz->zip_code,
                    ])),
                    'gstin'   => $biz->gstin,
                    'logo'    => $biz->logo ?? null,
                ] : null,

                'customer_name'  => $order->customer?->name  ?? 'Cash Sale',
                'customer_phone' => $order->customer?->phone  ?? $order->customer?->mobile,
                'customer_email' => $order->customer?->email,
                'customer_gstin' => $order->customer?->gstin  ?? $order->customer?->gst_number,

                'items' => $order->items->map(fn($it) => [
                    'name'            => $it->name,
                    'sku'             => $it->sku,
                    'description'     => $it->description,
                    'hsn_code'        => $it->hsn_code,
                    'quantity'        => $it->quantity,
                    'unit'            => $it->unit,
                    'unit_price'      => $it->unit_price,
                    'discount_amount' => $it->discount_amount,
                    'tax_amount'      => $it->tax_amount,
                    'taxable_amount'  => $it->taxable_amount,
                    'subtotal'        => $it->subtotal,
                    'total'           => $it->total,
                    'cgst_rate'       => $it->cgst_rate,
                    'sgst_rate'       => $it->sgst_rate,
                    'igst_rate'       => $it->igst_rate,
                    'cgst_amount'     => $it->cgst_amount,
                    'sgst_amount'     => $it->sgst_amount,
                    'igst_amount'     => $it->igst_amount,
                ]),

                'payments' => ($order->relationLoaded('payments') ? $order->payments : collect())
                    ->map(fn($p) => [
                        'amount' => $p->amount,
                        'method' => $p->payment_method ?? $p->method,
                        'date'   => $p->payment_date   ?? $p->created_at,
                    ]),
            ],
        ]);
    }
}   