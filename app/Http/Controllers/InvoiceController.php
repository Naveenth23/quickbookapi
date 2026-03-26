<?php

namespace App\Http\Controllers;

use App\Models\{Invoice, InvoiceItem, Payment, Product};
use App\Services\InvoiceNumberService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        $q = Invoice::with('customer')->latest();
        if ($s = $request->get('search')) {
            $q->where(function ($x) use ($s) {
                $x->where('invoice_number', 'like', "%$s%")
                    ->orWhereHas('customer', fn($c) => $c->where('name', 'like', "%$s%"));
            });
        }

        if ($st = $request->get('status')) {
            $q->where('payment_status', $st);
        }

        return $q->paginate(10);
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_id' => 'required|exists:parties,id',
            'items'       => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.qty' => 'required|numeric|min:1',
            'discount_value' => 'nullable|numeric|min:0',
            'shipping_charge' => 'nullable|numeric|min:0'
        ]);

        $user = $request->user();
        $businessId = $user->business_id;

        DB::beginTransaction();

        try {
            // Generate Invoice Number
            $invoiceNumber = InvoiceNumberService::generate($businessId);

            $invoice = Invoice::create([
                'business_id'    => $businessId,
                'customer_id'    => $request->customer_id,
                'invoice_date'   => now(),
                'invoice_number' => $invoiceNumber,
                'payment_status' => 'unpaid',
                'discount_type'  => $request->discount_type,
                'discount_value' => $request->discount_value ?? 0,
                'shipping_charge' => $request->shipping_charge ?? 0,
            ]);

            $subtotal = 0;
            $totalTax = 0;
            $itemsData = [];

            foreach ($request->items as $row) {
                $product = Product::where('business_id', $businessId)->findOrFail($row['product_id']);

                if ($product->quantity < $row['qty']) {
                    DB::rollBack();
                    return response()->json([
                        'error' => $product->name . ' — insufficient stock'
                    ], 422);
                }

                // update stock
                $product->decrement('quantity', $row['qty']);

                $lineBase = $product->sale_price * $row['qty'];
                $lineTax  = ($lineBase * $product->tax_rate) / 100;
                $lineTotal = $lineBase + $lineTax;

                $subtotal += $lineBase;
                $totalTax += $lineTax;

                $itemsData[] = [
                    'invoice_id' => $invoice->id,
                    'product_id' => $product->id,
                    'qty'        => $row['qty'],
                    'price'      => $product->sale_price,
                    'tax_rate'   => $product->tax_rate,
                    'cgst'       => round($lineTax / 2, 2),
                    'sgst'       => round($lineTax / 2, 2),
                    'total'      => round($lineTotal, 2),
                ];
            }

            InvoiceItem::insert($itemsData);

            /* ✅ Discount Calculation */
            $discountValue = $request->discount_value ?? 0;
            $discountAmount = $request->discount_type === '%'
                ? ($subtotal * $discountValue / 100)
                : $discountValue;

            $taxableValue = max($subtotal - $discountAmount, 0);

            /* ✅ Final Total = taxable + GST + shipping */
            $shipping = $request->shipping_charge ?? 0;
            $payable = $taxableValue + $totalTax + $shipping;

            /* ✅ Update invoice totals */
            $invoice->update([
                'total_amount'    => round($subtotal, 2),
                'discount_amount' => round($discountAmount, 2),
                'taxable_amount'  => round($taxableValue, 2),
                'tax_amount'      => round($totalTax, 2),
                'shipping_charge' => round($shipping, 2),
                'payable_amount'  => round($payable, 2)
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Invoice created successfully ✅',
                'invoice' => $invoice->load('items.product', 'customer')
            ], 201);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        return Invoice::with(['items.product', 'customer'])->findOrFail($id);
    }

    public function destroy($id)
    {
        $invoice = Invoice::findOrFail($id);

        // ✅ Restore stock back!
        foreach ($invoice->items as $item) {
            $item->product->increment('quantity', $item->qty);
        }

        $invoice->delete();

        return response()->json(['message' => 'Invoice deleted successfully']);
    }

    public function download($id)
    {
        $invoice = Invoice::with(['items.product', 'business', 'customer'])->findOrFail($id);

        // ✅ Calculate CGST/SGST splits per item
        foreach ($invoice->items as $item) {
            $taxAmount = ($item->qty * $item->price * $item->tax_rate) / 100;
            $item->cgst = $taxAmount / 2;
            $item->sgst = $taxAmount / 2;
        }

        $pdf = Pdf::loadView('invoice.pdf', compact('invoice'))
            ->setPaper('A4', 'portrait');

        return $pdf->download("Invoice-.pdf");
    }

    public function printPdf($id)
    {
        $invoice = Invoice::with(['items.product', 'business', 'customer'])->findOrFail($id);

        foreach ($invoice->items as $item) {
            $taxAmount = ($item->qty * $item->price * $item->tax_rate) / 100;
            $item->cgst = $taxAmount / 2;
            $item->sgst = $taxAmount / 2;
        }

        $pdf = Pdf::loadView('invoice.pdf', compact('invoice'))->setPaper('A4', 'portrait');

        return response($pdf->output(), 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'inline; filename="Invoice-.pdf');
    }


    public function addPayment(Request $request, $id)
    {
        $invoice = Invoice::with('payments')->findOrFail($id);

        $request->validate([
            'amount' => 'required|numeric|min:1',
            'method' => 'required|string',
            'payment_date' => 'required|date'
        ]);

        $paidBefore = $invoice->payments->sum('amount');
        $newPaid = $paidBefore + $request->amount;

        Payment::create([
            'invoice_id' => $invoice->id,
            'business_id' => $invoice->business_id,
            'amount' => $request->amount,
            'method' => $request->method,
            'payment_date' => $request->payment_date
        ]);

        // ✅ update payment status automatically
        if ($newPaid >= $invoice->payable_amount) {
            $invoice->payment_status = 'paid';
        } elseif ($newPaid > 0) {
            $invoice->payment_status = 'partial';
        } else {
            $invoice->payment_status = 'unpaid';
        }

        $invoice->save();

        return response()->json([
            'message' => 'Payment recorded successfully',
            'invoice' => $invoice->fresh('payments')
        ]);
    }
}
