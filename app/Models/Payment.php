<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'payment_number',
        'payment_type',
        'payment_method',
        'amount',
        'payment_date',
        'reference_number',
        'bank_name',
        'account_number',
        'ifsc_code',
        'card_last_four',
        'upi_id',
        'wallet_provider',
        'attachment',
        'notes',
        'is_refund',
        'refund_amount',
        'refund_date',
        'refund_reason',
        'is_cancelled',
        'cancelled_date',
        'cancellation_reason',
        'custom_fields',
        'business_id',
        'order_id',
        'purchase_id',
        'expense_id',
        'customer_id',
        'supplier_id',
        'received_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'payment_date' => 'date',
        'refund_date' => 'date',
        'cancelled_date' => 'date',
        'amount' => 'decimal:2',
        'refund_amount' => 'decimal:2',
        'is_refund' => 'boolean',
        'is_cancelled' => 'boolean',
        'custom_fields' => 'array',
    ];
    /**
     * Get the business that owns the payment.
     */
    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    /**
     * Get the order that owns the payment.
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Get the purchase that owns the payment.
     */
    public function purchase(): BelongsTo
    {
        return $this->belongsTo(Purchase::class);
    }

    /**
     * Get the expense that owns the payment.
     */
    public function expense(): BelongsTo
    {
        return $this->belongsTo(Expense::class);
    }

    /**
     * Get the customer that owns the payment.
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * Get the supplier that owns the payment.
     */
    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    /**
     * Get the user that received the payment.
     */
    public function receivedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'received_by');
    }

    /**
     * Scope payments by type.
     */
    public function scopeByType($query, string $type)
    {
        return $query->where('payment_type', $type);
    }

    /**
     * Scope payments by method.
     */
    public function scopeByMethod($query, string $method)
    {
        return $query->where('payment_method', $method);
    }

    /**
     * Scope active payments (not cancelled).
     */
    public function scopeActive($query)
    {
        return $query->where('is_cancelled', false);
    }

    /**
     * Scope refund payments.
     */
    public function scopeRefunds($query)
    {
        return $query->where('is_refund', true);
    }

    /**
     * Check if payment is a refund.
     */
    public function isRefund(): bool
    {
        return $this->is_refund;
    }

    /**
     * Check if payment is cancelled.
     */
    public function isCancelled(): bool
    {
        return $this->is_cancelled;
    }

    /**
     * Get net payment amount (excluding refunds).
     */
    public function getNetAmountAttribute(): float
    {
        if ($this->is_refund) {
            return 0;
        }
        return $this->amount - $this->refund_amount;
    }
}