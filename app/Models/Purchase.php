<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Purchase extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'purchase_number',
        'purchase_date',
        'due_date',
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
        'invoice_number',
        'invoice_date',
        'custom_fields',
        'business_id',
        'supplier_id',
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
            'purchase_date' => 'date',
            'due_date' => 'date',
            'invoice_date' => 'date',
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
     * Get the business that owns the purchase.
     */
    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    /**
     * Get the supplier that owns the purchase.
     */
    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    /**
     * Get the user that created the purchase.
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the purchase items for the purchase.
     */
    public function purchaseItems(): HasMany
    {
        return $this->hasMany(PurchaseItem::class);
    }

    /**
     * Get the payments for the purchase.
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Scope purchases by status.
     */
    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope active purchases.
     */
    public function scopeActive($query)
    {
        return $query->whereIn('status', ['draft', 'pending']);
    }

    /**
     * Scope completed purchases.
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Scope overdue purchases.
     */
    public function scopeOverdue($query)
    {
        return $query->where('status', 'pending')
                     ->where('due_date', '<', now());
    }

    /**
     * Check if purchase is overdue.
     */
    public function isOverdue(): bool
    {
        return $this->status === 'pending' && $this->due_date && $this->due_date < now();
    }

    /**
     * Check if purchase is paid.
     */
    public function isPaid(): bool
    {
        return $this->balance_amount <= 0;
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