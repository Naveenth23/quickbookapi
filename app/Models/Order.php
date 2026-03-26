<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Traits\BelongsToBusiness;
use App\Traits\HasUuid;

class Order extends Model
{
    use HasFactory;
    use HasUuid, BelongsToBusiness;
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'order_number',
        'invoice_number',
        'reference_number',
        'order_date',
        'due_date',
        'order_type',
        'status',
        'payment_status',
        'payment_method',
        'subtotal',
        'tax_amount',
        'discount_amount',
        'shipping_amount',
        'round_off',
        'total',
        'paid',
        'balance',
        'taxable_amount',
        'cgst_amount',
        'sgst_amount',
        'igst_amount',
        'cess_amount',
        'exchange_rate',
        'currency',
        'notes',
        'terms_and_conditions',
        'shipping_address',
        'billing_address',
        'shipped_date',
        'total_amount',
        'delivered_date',
        'paid_date',
        'tracking_number',
        'ewaybill_number',
        'is_recurring',
        'recurring_frequency',
        'recurring_until',
        'is_draft',
        'is_cancelled',
        'cancelled_date',
        'cancellation_reason',
        'custom_fields',
        'business_id',
        'customer_id',
        'supplier_id',
        'created_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'order_date'        => 'date',
        'due_date'          => 'date',
        'shipped_date'      => 'date',
        'delivered_date'    => 'date',
        'paid_date'         => 'date',
        'cancelled_date'    => 'date',
        'recurring_until'   => 'date',
        'subtotal'          => 'decimal:2',
        'tax_amount'        => 'decimal:2',
        'discount_amount'   => 'decimal:2',
        'total_amount'   => 'decimal:2',
        'shipping_amount'   => 'decimal:2',
        'round_off'         => 'decimal:2',
        'total'             => 'decimal:2',
        'paid'              => 'decimal:2',
        'balance'           => 'decimal:2',
        'taxable_amount'    => 'decimal:2',
        'cgst_amount'       => 'decimal:2',
        'sgst_amount'       => 'decimal:2',
        'igst_amount'       => 'decimal:2',
        'cess_amount'       => 'decimal:2',
        'exchange_rate'     => 'decimal:6',
        'is_recurring'      => 'boolean',
        'is_draft'          => 'boolean',
        'is_cancelled'      => 'boolean',
        'custom_fields'     => 'array',
    ];

    protected static function booted(): void
    {
        static::creating(function (Order $order) {
            if (empty($order->uuid)) {
                $order->uuid = (string) Str::uuid();
            }
        });
    }

    /**
     * Relationships
     */
    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Query Scopes
     */
    public function scopeActive($query)
    {
        return $query->where('is_cancelled', false);
    }

    public function scopeDraft($query)
    {
        return $query->where('is_draft', true);
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeOverdue($query)
    {
        return $query->where('due_date', '<', now())
                     ->where('payment_status', '!=', 'paid')
                     ->where('is_cancelled', false);
    }

    public function scopeForBusiness($query, int $businessId)
    {
        return $query->where('business_id', $businessId);
    }
 
    public function scopeUnpaid($query)
    {
        return $query->whereIn('status', ['unpaid', 'partial', 'overdue']);
    }

    /**
     * Utility Methods
     */
    public function isOverdue(): bool
    {
        return $this->due_date && $this->due_date->isPast()
            && $this->payment_status !== 'paid'
            && !$this->is_cancelled;
    }

    public function isPaid(): bool
    {
        return $this->payment_status === 'paid';
    }

    public function getTotalTaxAttribute(): float
    {
        return (float) (
            ($this->cgst_amount ?? 0) +
            ($this->sgst_amount ?? 0) +
            ($this->igst_amount ?? 0) +
            ($this->cess_amount ?? 0)
        );
    }

    public function updatePaymentStatus(): void
    {
        if ($this->paid >= $this->total) {
            $this->payment_status = 'paid';
        } elseif ($this->paid > 0) {
            $this->payment_status = 'partial';
        } else {
            $this->payment_status = 'pending';
        }

        $this->save();
    }
}
