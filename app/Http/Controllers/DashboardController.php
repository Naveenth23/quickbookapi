<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Invoice;
use App\Models\Expense;
use App\Models\Order;
use App\Models\Product;
use App\Models\State;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        try {
            $toCollect = Order::where('payment_status', 'unpaid')->sum('total_amount');
            $toPay = 0; // optional: based on purchases
            $totalBalance = Order::where('payment_status', 'paid')->sum('total_amount');

            $transactions = Order::latest()
                ->take(5)
                ->get([
                    'order_date as date',
                    'order_type as type',
                    'invoice_number as txn_no',
                    // 'customer_name as party_name',
                    'total_amount as amount'
                ]);

            // 🟢 SALES CHART DATA (last 7 days)
            $salesData = Order::select(
                DB::raw('DATE(order_date) as date'),
                DB::raw('SUM(total_amount) as total')
            )
                ->where('order_type', 'sale')
                ->whereBetween('order_date', [now()->subDays(6), now()])
                ->groupBy('date')
                ->orderBy('date')
                ->get();

            $chart = [
                'labels' => $salesData->pluck('date')->map(fn($d) => date('d M', strtotime($d))),
                'totals' => $salesData->pluck('total'),
            ];

            return response()->json([
                'success' => true,
                'stats' => [
                    'toCollect' => $toCollect,
                    'toPay' => $toPay,
                    'totalBalance' => $totalBalance,
                ],
                'transactions' => $transactions,
                'chart' => $chart,
                'last_updated' => now()->format('d M Y | h:i A'),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch dashboard data: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function states()
    {
        return response()->json([
            'success' => true,
            'data' => State::orderBy('name')->get(),
        ]);
    }
}
