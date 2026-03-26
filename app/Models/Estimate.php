<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Estimate extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'estimate_number',
        'estimate_date',
        'expiry_date',
        'status',
        'subtotal',
        'discount_amount',
        'discount_percent',
        'tax_amount',
        'cgst_amount',
        'sgst_amount',
        'igst_amount',
        'cess_amount',
        'total',
        'paid_amount',
        'balance_amount',
        'notes',
        'terms_conditions',
        'reference',
        'shipping_address',
        'billing_address',
        'currency',
        'exchange_rate',
        'is_gst_invoice',
        'gst_type',
        'reverse_charge',
        'ewaybill_number',
        'custom_fields',
        'business_id',
        'customer_id',
        'converted_to_order_id',
        'created_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts(): array
    {
        return [
            'estimate_date' => 'date',
            'expiry_date' => 'date',
            'subtotal' => 'decimal:2',
            'discount_amount' => 'decimal:2',
            'discount_percent' => 'decimal:2',
            'tax_amount' => 'decimal:2',
            'cgst_amount' => 'decimal:2',
            'sgst_amount' => 'decimal:2',
            'igst_amount' => 'decimal:2',
            'cess_amount' => 'decimal:2',
            'total' => 'decimal:2',
            'paid_amount' => 'decimal:2',
            'balance_amount' => 'decimal:2',
            'exchange_rate' => 'decimal:4',
            'reverse_charge' => 'boolean',
            'is_gst_invoice' => 'boolean',
            'custom_fields' => 'array',
        ];
    }

    /**
     * Get the business that owns the estimate.
     */
    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    /**
     * Get the customer that owns the estimate.
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * Get the order this estimate was converted to.
     */
    public function convertedToOrder(): BelongsTo
    {
        return $this->belongsTo(Order::class, 'converted_to_order_id');
    }

    /**
     * Get the user that created the estimate.
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the estimate items for the estimate.
     */
    public function estimateItems(): HasMany
    {
        return $this->hasMany(EstimateItem::class);
    }

    /**
     * Scope estimates by status.
     */
    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope active estimates.
     */
    public function scopeActive($query)
    {
        return $query->whereIn('status', ['draft', 'sent', 'viewed']);
    }

    /**
     * Scope expired estimates.
     */
    public function scopeExpired($query)
    {
        return $query->where('expiry_date', '<', now())->whereIn('status', ['sent', 'viewed']);
    }

    /**
     * Scope converted estimates.
     */
    public function scopeConverted($query)
    {
        return $query->whereNotNull('converted_to_order_id');
    }

    /**
     * Check if estimate is expired.
     */
    public function isExpired(): bool
    {
        return $this->expiry_date && $this->expiry_date < now();
    }

    /**
     * Check if estimate is converted to order.
     */
    public function isConverted(): bool
    {
        return !is_null($this->converted_to_order_id);
    }

    /**
     * Check if estimate can be converted.
     */
    public function canBeConverted(): bool
    {
        return in_array($this->status, ['sent', 'viewed', 'accepted']) && !$this->isExpired() && !$this->isConverted();
    }

    /**
     * Calculate total tax amount.
     */
    public function getTotalTaxAttribute(): float
    {
        return $this->cgst_amount + $this->sgst_amount + $this->igst_amount + $this->cess_amount;
    }

    /**
     * Calculate net amount after discount.
     */
    public function getNetAmountAttribute(): float
    {
        return $this->subtotal - $this->discount_amount;
    }

    /**
     * Check if estimate is fully paid.
     */
    public function isPaid(): bool
    {
        return $this->balance_amount <= 0;
    }

    /**
     * Get payment status.
     */
    public function getPaymentStatusAttribute(): string
    {
        if ($this->isPaid()) {
            return 'paid';
        } elseif ($this->paid_amount > 0) {
            return 'partial';
        }
        return 'unpaid';
    }
}