<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Invoice;
use App\Models\Purchase;
use App\Models\Party;
use App\Models\Product;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function sales(Request $request)
    {
        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $businessId = $request->user()->business_id;

        $query = Invoice::where('business_id', $businessId);

        if ($request->filled('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        $sales = $query->with(['party', 'items.product'])->get();

        $totalRevenue = $sales->sum('total');
        $totalTax = $sales->sum('tax_total');

        return response()->json([
            'sales' => $sales,
            'total_revenue' => $totalRevenue,
            'total_tax' => $totalTax,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
        ]);
    }

    public function purchases(Request $request)
    {
        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $businessId = $request->user()->business_id;

        $query = Purchase::where('business_id', $businessId);

        if ($request->filled('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        $purchases = $query->with(['supplier', 'items.product'])->get();

        $totalPurchases = $purchases->sum('total');

        return response()->json([
            'purchases' => $purchases,
            'total_purchases' => $totalPurchases,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
        ]);
    }

    public function stock(Request $request)
    {
        $businessId = $request->user()->business_id;

        $products = Product::where('business_id', $businessId)
            ->with('category')
            ->get();

        return response()->json([
            'products' => $products,
        ]);
    }

    public function customers(Request $request)
    {
        $businessId = $request->user()->business_id;

        $customers = Party::where('business_id', $businessId)
            ->where('type', 'customer')
            ->with('invoices')
            ->get();

        return response()->json([
            'customers' => $customers,
        ]);
    }

    public function suppliers(Request $request)
    {
        $businessId = $request->user()->business_id;

        $suppliers = Party::where('business_id', $businessId)
            ->where('type', 'supplier')
            ->with('purchases')
            ->get();

        return response()->json([
            'suppliers' => $suppliers,
        ]);
    }

    public function gstr1(Request $request)
    {
        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $businessId = $request->user()->business_id;

        $query = Invoice::where('business_id', $businessId);

        if ($request->filled('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        $invoices = $query->with(['party', 'items.product'])->get();

        // Group by tax rate
        $taxSummary = [];
        $totalTaxableValue = 0;
        $totalTaxAmount = 0;

        foreach ($invoices as $invoice) {
            foreach ($invoice->items as $item) {
                $taxRate = $item->product->tax_rate;
                $taxableValue = $item->quantity * $item->price;
                $taxAmount = ($taxableValue * $taxRate) / 100;

                if (!isset($taxSummary[$taxRate])) {
                    $taxSummary[$taxRate] = [
                        'tax_rate' => $taxRate,
                        'taxable_value' => 0,
                        'tax_amount' => 0,
                    ];
                }

                $taxSummary[$taxRate]['taxable_value'] += $taxableValue;
                $taxSummary[$taxRate]['tax_amount'] += $taxAmount;
                $totalTaxableValue += $taxableValue;
                $totalTaxAmount += $taxAmount;
            }
        }

        return response()->json([
            'invoices' => $invoices,
            'tax_summary' => array_values($taxSummary),
            'total_taxable_value' => $totalTaxableValue,
            'total_tax_amount' => $totalTaxAmount,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
        ]);
    }

    public function gstr3b(Request $request)
    {
        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $businessId = $request->user()->business_id;

        // Outward supplies (sales)
        $salesQuery = Invoice::where('business_id', $businessId);
        if ($request->filled('start_date')) {
            $salesQuery->whereDate('created_at', '>=', $request->start_date);
        }
        if ($request->filled('end_date')) {
            $salesQuery->whereDate('created_at', '<=', $request->end_date);
        }
        $sales = $salesQuery->with(['items.product'])->get();

        // Inward supplies (purchases)
        $purchasesQuery = Purchase::where('business_id', $businessId);
        if ($request->filled('start_date')) {
            $purchasesQuery->whereDate('created_at', '>=', $request->start_date);
        }
        if ($request->filled('end_date')) {
            $purchasesQuery->whereDate('created_at', '<=', $request->end_date);
        }
        $purchases = $purchasesQuery->with(['items.product'])->get();

        // Calculate outward tax liability
        $outwardTax = [];
        $totalOutwardTaxable = 0;
        $totalOutwardTax = 0;

        foreach ($sales as $invoice) {
            foreach ($invoice->items as $item) {
                $taxRate = $item->product->tax_rate;
                $taxableValue = $item->quantity * $item->price;
                $taxAmount = ($taxableValue * $taxRate) / 100;

                if (!isset($outwardTax[$taxRate])) {
                    $outwardTax[$taxRate] = [
                        'tax_rate' => $taxRate,
                        'taxable_value' => 0,
                        'tax_amount' => 0,
                    ];
                }

                $outwardTax[$taxRate]['taxable_value'] += $taxableValue;
                $outwardTax[$taxRate]['tax_amount'] += $taxAmount;
                $totalOutwardTaxable += $taxableValue;
                $totalOutwardTax += $taxAmount;
            }
        }

        // Calculate input tax credit
        $inputTax = [];
        $totalInputTaxable = 0;
        $totalInputTax = 0;

        foreach ($purchases as $purchase) {
            foreach ($purchase->items as $item) {
                $taxRate = $item->product->tax_rate;
                $taxableValue = $item->quantity * $item->price;
                $taxAmount = ($taxableValue * $taxRate) / 100;

                if (!isset($inputTax[$taxRate])) {
                    $inputTax[$taxRate] = [
                        'tax_rate' => $taxRate,
                        'taxable_value' => 0,
                        'tax_amount' => 0,
                    ];
                }

                $inputTax[$taxRate]['taxable_value'] += $taxableValue;
                $inputTax[$taxRate]['tax_amount'] += $taxAmount;
                $totalInputTaxable += $taxableValue;
                $totalInputTax += $taxAmount;
            }
        }

        // Net tax liability
        $netTaxLiability = $totalOutwardTax - $totalInputTax;

        return response()->json([
            'outward_supplies' => [
                'summary' => array_values($outwardTax),
                'total_taxable_value' => $totalOutwardTaxable,
                'total_tax_amount' => $totalOutwardTax,
            ],
            'input_tax_credit' => [
                'summary' => array_values($inputTax),
                'total_taxable_value' => $totalInputTaxable,
                'total_tax_amount' => $totalInputTax,
            ],
            'net_tax_liability' => $netTaxLiability,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
        ]);
    }
}