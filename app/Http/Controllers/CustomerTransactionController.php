<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Payment;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * GET /customers/{customer}/transactions
 *
 * Returns a unified, date-filtered list of:
 *   - Received payments  (payments table, payment_type = 'sale')
 *   - Sales invoices     (orders table)
 *
 * Both are shaped into a common structure so the Flutter app
 * can render them with a single card widget.
 *
 * Tenant isolation: every query is scoped to app('currentBusiness')->id.
 */
class CustomerTransactionController extends Controller
{
    // ── Tenant helper ─────────────────────────────────────────────────────────

    private function businessId(): int
    {
        $business = app('currentBusiness');

        if (! $business) {
            abort(401, 'Business context not found.');
        }

        return (int) $business->id;
    }

    // ── GET /customers/{customer}/transactions ────────────────────────────────

    public function index(Request $request, int $customer): JsonResponse
    {
        $request->validate([
            'from'     => 'nullable|date',
            'to'       => 'nullable|date|after_or_equal:from',
            'type'     => 'nullable|in:payment,invoice,all',
            'per_page' => 'nullable|integer|min:1|max:200',
        ]);

        $bizId = $this->businessId();

        // ── Verify this customer belongs to the current tenant ────────────────
        $customerModel = Customer::where('business_id', $bizId)
            ->findOrFail($customer);

        $from     = $request->input('from', now()->subDays(364)->toDateString());
        $to       = $request->input('to',   now()->toDateString());
        $type     = $request->input('type', 'all');
        $perPage  = (int) $request->input('per_page', 100);

        $transactions = collect();

        // ── 1. Received payments ──────────────────────────────────────────────
        if (in_array($type, ['payment', 'all'])) {
            $payments = Payment::where('business_id', $bizId)
                ->where('customer_id', $customer)
                ->where('is_cancelled', false)
                ->whereIn('payment_type', ['sale', 'income'])
                ->whereBetween('payment_date', [$from, $to])
                ->orderByDesc('payment_date')
                ->orderByDesc('id')
                ->get()
                ->map(fn ($p) => $this->formatPayment($p));

            $transactions = $transactions->concat($payments);
        }

        // ── 2. Sales invoices / orders ────────────────────────────────────────
        if (in_array($type, ['invoice', 'all'])) {
            $orders = Order::where('business_id', $bizId)
                ->where('customer_id', $customer)
                ->whereBetween('order_date', [$from, $to])
                ->orderByDesc('order_date')
                ->orderByDesc('id')
                ->get()
                ->map(fn ($o) => $this->formatOrder($o));

            $transactions = $transactions->concat($orders);
        }

        // ── Sort merged list by date descending then paginate manually ────────
        $sorted = $transactions
            ->sortByDesc('sort_date')
            ->values();

        $page    = (int) $request->input('page', 1);
        $offset  = ($page - 1) * $perPage;
        $items   = $sorted->slice($offset, $perPage)->values();
        $total   = $sorted->count();

        // ── Summary totals ────────────────────────────────────────────────────
        $totalReceived = $transactions
            ->where('type', 'payment')
            ->sum('amount');

        $totalInvoiced = $transactions
            ->where('type', 'invoice')
            ->sum('amount');

        $totalPaid = $transactions
            ->where('type', 'invoice')
            ->where('status', 'paid')
            ->sum('amount');

        return response()->json([
            'success' => true,
            'data'    => $items,
            'meta'    => [
                'total'        => $total,
                'per_page'     => $perPage,
                'current_page' => $page,
                'last_page'    => (int) ceil($total / max($perPage, 1)),
                'from'         => $from,
                'to'           => $to,
            ],
            'summary' => [
                'total_received' => round($totalReceived, 2),
                'total_invoiced' => round($totalInvoiced, 2),
                'total_paid'     => round($totalPaid,     2),
                'outstanding'    => round($totalInvoiced - $totalPaid, 2),
            ],
        ]);
    }

    // ── GET /customers/{customer}/transactions/{txnId} ────────────────────────
    // Returns full detail for one transaction (payment or invoice).

    public function show(Request $request, int $customer, string $txnId): JsonResponse
    {
        $bizId = $this->businessId();

        Customer::where('business_id', $bizId)->findOrFail($customer);

        // txnId format: "pay_123"  or  "inv_456"
        [$prefix, $id] = explode('_', $txnId, 2) + [null, null];

        if ($prefix === 'pay') {
            $payment = Payment::where('business_id', $bizId)
                ->where('customer_id', $customer)
                ->findOrFail((int) $id);

            return response()->json([
                'success' => true,
                'data'    => $this->formatPayment($payment, detailed: true),
            ]);
        }

        if ($prefix === 'inv') {
            $order = Order::where('business_id', $bizId)
                ->where('customer_id', $customer)
                ->findOrFail((int) $id);

            return response()->json([
                'success' => true,
                'data'    => $this->formatOrder($order, detailed: true),
            ]);
        }

        abort(404, 'Transaction not found.');
    }

    // ── Formatters ────────────────────────────────────────────────────────────

    /**
     * Normalise a Payment row into the unified transaction shape.
     */
    private function formatPayment(Payment $p, bool $detailed = false): array
    {
        $base = [
            'id'             => 'pay_' . $p->id,
            'type'           => 'payment',
            'payment_number' => $p->payment_number,
            'payment_type'   => $p->payment_type,
            'payment_method' => $p->payment_method,
            'amount'         => (float) $p->amount,
            'discount'       => 0.0,          // payments table has no discount col
            'payment_date'   => $p->payment_date?->toDateString(),
            'sort_date'      => $p->payment_date?->toDateString(),
            'reference_number' => $p->reference_number,
            'notes'          => $p->notes,
            'is_refund'      => (bool) $p->is_refund,
            'refund_amount'  => (float) $p->refund_amount,
            'created_at'     => $p->created_at?->toIso8601String(),
        ];

        if ($detailed) {
            $base['upi_id']          = $p->upi_id;
            $base['bank_name']       = $p->bank_name;
            $base['account_number']  = $p->account_number;
            $base['card_last_four']  = $p->card_last_four;
            $base['attachment']      = $p->attachment
                ? asset('storage/' . $p->attachment)
                : null;
            $base['received_by']     = $p->receivedBy?->name;
            $base['order']           = $p->order
                ? ['id' => $p->order_id, 'invoice_number' => $p->order?->invoice_number]
                : null;
        }

        return $base;
    }

    /**
     * Normalise an Order row into the unified transaction shape.
     */
    private function formatOrder(Order $o, bool $detailed = false): array
    {
        $status = $this->deriveInvoiceStatus($o);

        $base = [
            'id'             => 'inv_' . $o->id,
            'type'           => 'invoice',
            'invoice_number' => $o->invoice_number,
            'order_number'   => $o->order_number ?? $o->invoice_number,
            'amount'         => (float) $o->total,
            'paid_amount'    => (float) ($o->paid_amount ?? 0),
            'due_amount'     => (float) ($o->due_amount ?? max(0, $o->total - ($o->paid_amount ?? 0))),
            'invoice_date'   => $o->order_date?->toDateString(),
            'due_date'       => $o->due_date?->toDateString(),
            'sort_date'      => $o->order_date?->toDateString(),
            'status'         => $status,
            'overdue_days'   => $this->overduedays($o, $status),
            'notes'          => $o->notes ?? null,
            'created_at'     => $o->created_at?->toIso8601String(),
        ];

        if ($detailed) {
            $base['sub_total']     = (float) ($o->sub_total ?? 0);
            $base['tax_amount']    = (float) ($o->tax ?? 0);
            $base['discount']      = (float) ($o->discount ?? 0);
            $base['items']         = $o->items ?? [];
            $base['payment_method'] = $o->payment_method ?? null;
        }

        return $base;
    }

    // ── Status helpers ────────────────────────────────────────────────────────

    private function deriveInvoiceStatus(Order $o): string
    {
        // Honour an explicit status column if it exists
        if (! empty($o->status)) {
            return strtolower($o->status);
        }

        $paid   = (float) ($o->paid_amount ?? 0);
        $total  = (float) ($o->total       ?? 0);

        if ($paid <= 0)           return 'unpaid';
        if ($paid >= $total)      return 'paid';

        // Partially paid — check if past due date
        if ($o->due_date && now()->gt($o->due_date)) {
            return 'overdue';
        }

        return 'partial';
    }

    private function overdueDays(Order $o, string $status): int
    {
        if ($status !== 'overdue' && $status !== 'unpaid') return 0;
        if (! $o->due_date) return 0;

        $days = (int) now()->startOfDay()->diffInDays($o->due_date->startOfDay(), false);
        return $days < 0 ? abs($days) : 0;
    }
}