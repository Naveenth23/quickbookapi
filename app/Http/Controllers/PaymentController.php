<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Customer;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class PaymentController extends Controller
{
    private function currentBusiness(): \App\Models\Business
    {
        $business = app('currentBusiness');

        if (!$business) {
            abort(401, 'Business context not found. Ensure the tenant middleware is applied.');
        }

        return $business;
    }

    /** Shorthand for just the ID. */
    private function businessId(): int
    {
        return $this->currentBusiness()->id;
    }

    /** Scope every query to the current tenant. */
    private function query()
    {
        return Payment::where('business_id', $this->businessId());
    }

    /** Generate the next sequential payment number: PAY-00001, PAY-00002 … */
    private function nextPaymentNumber(): string
    {
        $last = Payment::where('business_id', $this->businessId())
            ->orderByDesc('id')
            ->lockForUpdate()
            ->value('payment_number');

        $next = $last
            ? (int) substr($last, 4) + 1
            : 1;

        return 'PAY-' . str_pad($next, 5, '0', STR_PAD_LEFT);
    }

    // ── LIST  GET /payments ────────────────────────────────────────────────

    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'payment_type'   => ['nullable', Rule::in(['sale', 'purchase', 'expense', 'income', 'refund'])],
            'payment_method' => ['nullable', Rule::in(['cash', 'card', 'upi', 'bank_transfer', 'cheque', 'wallet', 'other'])],
            'customer_id'    => 'nullable|integer',
            'supplier_id'    => 'nullable|integer',
            'from'           => 'nullable|date',
            'to'             => 'nullable|date',
            'search'         => 'nullable|string|max:100',
            'is_cancelled'   => 'nullable|boolean',
            'per_page'       => 'nullable|integer|min:1|max:100',
        ]);

        $q = $this->query()
            ->with(['customer:id,name,phone', 'supplier:id,name,phone', 'receivedBy:id,name'])
            ->when($request->payment_type,   fn($q) => $q->where('payment_type',   $request->payment_type))
            ->when($request->payment_method, fn($q) => $q->where('payment_method', $request->payment_method))
            ->when($request->customer_id,    fn($q) => $q->where('customer_id',    $request->customer_id))
            ->when($request->supplier_id,    fn($q) => $q->where('supplier_id',    $request->supplier_id))
            ->when($request->from,           fn($q) => $q->whereDate('payment_date', '>=', $request->from))
            ->when($request->to,             fn($q) => $q->whereDate('payment_date', '<=', $request->to))
            ->when($request->filled('is_cancelled'), fn($q) => $q->where('is_cancelled', (bool) $request->is_cancelled))
            ->when($request->search, function ($q) use ($request) {
                $s = '%' . $request->search . '%';
                $q->where(function ($q) use ($s) {
                    $q->where('payment_number', 'like', $s)
                      ->orWhere('reference_number', 'like', $s)
                      ->orWhereHas('customer', fn($q) => $q->where('name', 'like', $s)->orWhere('phone', 'like', $s))
                      ->orWhereHas('supplier', fn($q) => $q->where('name', 'like', $s));
                });
            })
            ->orderByDesc('payment_date')
            ->orderByDesc('id');

        $perPage = $request->input('per_page', 30);
        $paginated = $q->paginate($perPage);

        return response()->json([
            'success' => true,
            'data'    => $paginated->items(),
            'meta'    => [
                'total'        => $paginated->total(),
                'per_page'     => $paginated->perPage(),
                'current_page' => $paginated->currentPage(),
                'last_page'    => $paginated->lastPage(),
            ],
        ]);
    }

    // ── SHOW  GET /payments/{id} ───────────────────────────────────────────

    public function show(int $id): JsonResponse
    {
        $payment = $this->query()
            ->with(['customer:id,name,phone', 'supplier:id,name,phone', 'receivedBy:id,name', 'order:id,invoice_number', 'purchase:id,purchase_number'])
            ->findOrFail($id);

        return response()->json(['success' => true, 'data' => $payment]);
    }

    // ── RECORD PAYMENT IN  POST /payments/in ──────────────────────────────
    //   Money received from a customer (sale payment).

    public function recordIn(Request $request): JsonResponse
    {
        $data = $request->validate([
            'party_id'         => 'required|integer',           // customer id
            'amount'           => 'required|numeric|min:0.01',
            'discount'         => 'nullable|numeric|min:0',
            'payment_method'   => ['required', Rule::in(['cash', 'card', 'upi', 'bank_transfer', 'cheque', 'wallet', 'other'])],
            'date'             => 'required|date',
            'reference_number' => 'nullable|string|max:100',
            'bank_name'        => 'nullable|string|max:100',
            'account_number'   => 'nullable|string|max:50',
            'ifsc_code'        => 'nullable|string|max:20',
            'card_last_four'   => 'nullable|string|size:4',
            'upi_id'           => 'nullable|string|max:100',
            'wallet_provider'  => 'nullable|string|max:50',
            'notes'            => 'nullable|string|max:1000',
            'order_id'         => 'nullable|integer|exists:orders,id',
            'attachment'       => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'custom_fields'    => 'nullable|array',
        ]);

        // Ensure the customer belongs to this tenant
        $customer = Customer::where('business_id', $this->businessId())
            ->findOrFail($data['party_id']);

        return DB::transaction(function () use ($data, $customer, $request) {
            $attachmentPath = null;
            if ($request->hasFile('attachment')) {
                $attachmentPath = $request->file('attachment')
                    ->store("payments/{$this->businessId()}", 'public');
            }

            $payment = Payment::create([
                'payment_number'   => $this->nextPaymentNumber(),
                'payment_type'     => 'sale',
                'payment_method'   => $data['payment_method'],
                'amount'           => $data['amount'],
                'payment_date'     => $data['date'],
                'reference_number' => $data['reference_number'] ?? null,
                'bank_name'        => $data['bank_name'] ?? null,
                'account_number'   => $data['account_number'] ?? null,
                'ifsc_code'        => $data['ifsc_code'] ?? null,
                'card_last_four'   => $data['card_last_four'] ?? null,
                'upi_id'           => $data['upi_id'] ?? null,
                'wallet_provider'  => $data['wallet_provider'] ?? null,
                'notes'            => $data['notes'] ?? null,
                'attachment'       => $attachmentPath,
                'custom_fields'    => $data['custom_fields'] ?? null,
                'business_id'      => $this->businessId(),
                'customer_id'      => $customer->id,
                'order_id'         => $data['order_id'] ?? null,
                'received_by'      => Auth::id(),
            ]);

            // Adjust customer balance: receiving money reduces what they owe
            $net = $data['amount'] - ($data['discount'] ?? 0);
            $customer->decrement('current_balance', $net);

            return response()->json([
                'success' => true,
                'message' => 'Payment recorded successfully',
                'data'    => $payment->load('customer:id,name,phone'),
            ], 201);
        });
    }

    // ── RECORD PAYMENT OUT  POST /payments/out ────────────────────────────
    //   Money paid to a supplier (purchase payment).

    public function recordOut(Request $request): JsonResponse
    {
        $data = $request->validate([
            'party_id'         => 'required|integer',           // supplier id
            'amount'           => 'required|numeric|min:0.01',
            'payment_method'   => ['required', Rule::in(['cash', 'card', 'upi', 'bank_transfer', 'cheque', 'wallet', 'other'])],
            'date'             => 'required|date',
            'reference_number' => 'nullable|string|max:100',
            'bank_name'        => 'nullable|string|max:100',
            'account_number'   => 'nullable|string|max:50',
            'ifsc_code'        => 'nullable|string|max:20',
            'card_last_four'   => 'nullable|string|size:4',
            'upi_id'           => 'nullable|string|max:100',
            'wallet_provider'  => 'nullable|string|max:50',
            'notes'            => 'nullable|string|max:1000',
            'purchase_id'      => 'nullable|integer|exists:purchases,id',
            'attachment'       => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'custom_fields'    => 'nullable|array',
        ]);

        $supplier = Supplier::where('business_id', $this->businessId())
            ->findOrFail($data['party_id']);

        return DB::transaction(function () use ($data, $supplier, $request) {
            $attachmentPath = null;
            if ($request->hasFile('attachment')) {
                $attachmentPath = $request->file('attachment')
                    ->store("payments/{$this->businessId()}", 'public');
            }

            $payment = Payment::create([
                'payment_number'   => $this->nextPaymentNumber(),
                'payment_type'     => 'purchase',
                'payment_method'   => $data['payment_method'],
                'amount'           => $data['amount'],
                'payment_date'     => $data['date'],
                'reference_number' => $data['reference_number'] ?? null,
                'bank_name'        => $data['bank_name'] ?? null,
                'account_number'   => $data['account_number'] ?? null,
                'ifsc_code'        => $data['ifsc_code'] ?? null,
                'card_last_four'   => $data['card_last_four'] ?? null,
                'upi_id'           => $data['upi_id'] ?? null,
                'wallet_provider'  => $data['wallet_provider'] ?? null,
                'notes'            => $data['notes'] ?? null,
                'attachment'       => $attachmentPath,
                'custom_fields'    => $data['custom_fields'] ?? null,
                'business_id'      => $this->businessId(),
                'supplier_id'      => $supplier->id,
                'purchase_id'      => $data['purchase_id'] ?? null,
                'received_by'      => Auth::id(),
            ]);

            // Paying a supplier reduces what we owe them
            $supplier->decrement('current_balance', $data['amount']);

            return response()->json([
                'success' => true,
                'message' => 'Payment recorded successfully',
                'data'    => $payment->load('supplier:id,name,phone'),
            ], 201);
        });
    }

    // ── UPDATE  PUT /payments/{id} ─────────────────────────────────────────

    public function update(Request $request, int $id): JsonResponse
    {
        $payment = $this->query()->findOrFail($id);

        if ($payment->is_cancelled) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot edit a cancelled payment',
            ], 422);
        }

        $data = $request->validate([
            'payment_method'   => ['sometimes', Rule::in(['cash', 'card', 'upi', 'bank_transfer', 'cheque', 'wallet', 'other'])],
            'amount'           => 'sometimes|numeric|min:0.01',
            'date'             => 'sometimes|date',
            'reference_number' => 'nullable|string|max:100',
            'bank_name'        => 'nullable|string|max:100',
            'account_number'   => 'nullable|string|max:50',
            'ifsc_code'        => 'nullable|string|max:20',
            'card_last_four'   => 'nullable|string|size:4',
            'upi_id'           => 'nullable|string|max:100',
            'wallet_provider'  => 'nullable|string|max:50',
            'notes'            => 'nullable|string|max:1000',
            'attachment'       => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'custom_fields'    => 'nullable|array',
        ]);

        return DB::transaction(function () use ($data, $payment, $request) {
            // Reverse old balance impact, apply new one
            if (isset($data['amount']) && $data['amount'] != $payment->amount) {
                $diff = $data['amount'] - $payment->amount;
                if ($payment->customer_id) {
                    Customer::where('id', $payment->customer_id)
                        ->decrement('current_balance', $diff);
                } elseif ($payment->supplier_id) {
                    Supplier::where('id', $payment->supplier_id)
                        ->decrement('current_balance', $diff);
                }
            }

            if ($request->hasFile('attachment')) {
                if ($payment->attachment) {
                    Storage::disk('public')->delete($payment->attachment);
                }
                $data['attachment'] = $request->file('attachment')
                    ->store("payments/{$this->businessId()}", 'public');
            }

            // Map 'date' → 'payment_date'
            if (isset($data['date'])) {
                $data['payment_date'] = $data['date'];
                unset($data['date']);
            }

            $payment->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Payment updated successfully',
                'data'    => $payment->fresh(['customer:id,name', 'supplier:id,name']),
            ]);
        });
    }

    // ── CANCEL  POST /payments/{id}/cancel ────────────────────────────────

    public function cancel(Request $request, int $id): JsonResponse
    {
        $payment = $this->query()->findOrFail($id);

        if ($payment->is_cancelled) {
            return response()->json([
                'success' => false,
                'message' => 'Payment is already cancelled',
            ], 422);
        }

        $data = $request->validate([
            'cancellation_reason' => 'required|string|max:500',
        ]);

        return DB::transaction(function () use ($data, $payment) {
            // Reverse the balance change
            if ($payment->customer_id) {
                Customer::where('id', $payment->customer_id)
                    ->increment('current_balance', $payment->amount);
            } elseif ($payment->supplier_id) {
                Supplier::where('id', $payment->supplier_id)
                    ->increment('current_balance', $payment->amount);
            }

            $payment->update([
                'is_cancelled'        => true,
                'cancelled_date'      => now()->toDateString(),
                'cancellation_reason' => $data['cancellation_reason'],
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Payment cancelled successfully',
                'data'    => $payment->fresh(),
            ]);
        });
    }

    // ── REFUND  POST /payments/{id}/refund ────────────────────────────────

    public function refund(Request $request, int $id): JsonResponse
    {
        $payment = $this->query()->findOrFail($id);

        if ($payment->is_cancelled) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot refund a cancelled payment',
            ], 422);
        }

        if ($payment->is_refund) {
            return response()->json([
                'success' => false,
                'message' => 'Payment has already been refunded',
            ], 422);
        }

        $data = $request->validate([
            'refund_amount' => "required|numeric|min:0.01|max:{$payment->amount}",
            'refund_reason' => 'required|string|max:500',
            'refund_date'   => 'required|date',
        ]);

        return DB::transaction(function () use ($data, $payment) {
            $payment->update([
                'is_refund'     => true,
                'refund_amount' => $data['refund_amount'],
                'refund_date'   => $data['refund_date'],
                'refund_reason' => $data['refund_reason'],
            ]);

            // Create a mirror payment entry for the refund
            Payment::create([
                'payment_number'   => $this->nextPaymentNumber(),
                'payment_type'     => 'refund',
                'payment_method'   => $payment->payment_method,
                'amount'           => $data['refund_amount'],
                'payment_date'     => $data['refund_date'],
                'notes'            => 'Refund: ' . $data['refund_reason'],
                'is_refund'        => true,
                'refund_amount'    => $data['refund_amount'],
                'refund_date'      => $data['refund_date'],
                'refund_reason'    => $data['refund_reason'],
                'business_id'      => $payment->business_id,
                'customer_id'      => $payment->customer_id,
                'supplier_id'      => $payment->supplier_id,
                'order_id'         => $payment->order_id,
                'received_by'      => Auth::id(),
            ]);

            // Reverse balance: refund returns money to the party
            if ($payment->customer_id) {
                Customer::where('id', $payment->customer_id)
                    ->increment('current_balance', $data['refund_amount']);
            } elseif ($payment->supplier_id) {
                Supplier::where('id', $payment->supplier_id)
                    ->increment('current_balance', $data['refund_amount']);
            }

            return response()->json([
                'success' => true,
                'message' => 'Refund processed successfully',
                'data'    => $payment->fresh(),
            ]);
        });
    }

    // ── SUMMARY  GET /payments/summary ────────────────────────────────────

    public function summary(Request $request): JsonResponse
    {
        $request->validate([
            'from' => 'nullable|date',
            'to'   => 'nullable|date',
        ]);

        $base = $this->query()
            ->where('is_cancelled', false)
            ->when($request->from, fn($q) => $q->whereDate('payment_date', '>=', $request->from))
            ->when($request->to,   fn($q) => $q->whereDate('payment_date', '<=', $request->to));

        $totals = $base->selectRaw('
                payment_type,
                COUNT(*) as count,
                SUM(amount) as total,
                SUM(CASE WHEN is_refund = 1 THEN refund_amount ELSE 0 END) as refunded
            ')
            ->groupBy('payment_type')
            ->get()
            ->keyBy('payment_type');

        $byMethod = $base->selectRaw('payment_method, SUM(amount) as total')
            ->groupBy('payment_method')
            ->pluck('total', 'payment_method');

        return response()->json([
            'success' => true,
            'data'    => [
                'by_type'   => $totals,
                'by_method' => $byMethod,
            ],
        ]);
    }

    // ── DELETE ATTACHMENT  DELETE /payments/{id}/attachment ───────────────

    public function deleteAttachment(int $id): JsonResponse
    {
        $payment = $this->query()->findOrFail($id);

        if ($payment->attachment) {
            Storage::disk('public')->delete($payment->attachment);
            $payment->update(['attachment' => null]);
        }

        return response()->json(['success' => true, 'message' => 'Attachment removed']);
    }
}