<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Traits\BelongsToBusiness;

class Customer extends Model
{
    use HasFactory,BelongsToBusiness;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'customer_code',
        'name',
        'email',
        'phone',
        'alternate_phone',
        'company_name',
        'gstin',
        'billing_address',
        'shipping_address',
        'city',
        'state',
        'country',
        'zip_code',
        'opening_balance',
        'current_balance',
        'credit_limit',
        'payment_terms',
        'total_purchases',
        'total_orders',
        'last_order_date',
        'customer_type',
        'is_active',
        'notes',
        'custom_fields',
        'business_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'opening_balance' => 'decimal:2',
        'current_balance' => 'decimal:2',
        'credit_limit' => 'decimal:2',
        'total_purchases' => 'decimal:2',
        'total_orders' => 'decimal:2',
        'last_order_date' => 'datetime',
        'is_active' => 'boolean',
        'custom_fields' => 'array',
    ];

    /**
     * Relationships
     */
    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function estimates(): HasMany
    {
        return $this->hasMany(Estimate::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Accessors & Computed Attributes
     */

    /**
     * Get the full formatted billing address.
     */
    public function getFullAddressAttribute(): string
    {
        $parts = array_filter([
            $this->billing_address,
            $this->city,
            $this->state,
            $this->zip_code,
            $this->country,
        ]);

        return implode(', ', $parts);
    }

    /**
     * Determine if the customer exceeded their credit limit.
     */
    public function hasExceededCreditLimit(): bool
    {
        if (($this->credit_limit ?? 0) <= 0) {
            return false;
        }

        return ($this->current_balance ?? 0) > $this->credit_limit;
    }

    /**
     * Get available credit balance.
     */
    public function getAvailableCreditAttribute(): float
    {
        $limit = $this->credit_limit ?? 0;
        $balance = $this->current_balance ?? 0;

        if ($limit <= 0) {
            return 0.0;
        }

        return max(0, $limit - $balance);
    }

    /**
     * Query Scopes
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('customer_type', $type);
    }

    public function scopeWithOutstandingBalance($query)
    {
        return $query->where('current_balance', '>', 0);
    }

    public function scopeForBusiness($query, int $businessId)
    {
        return $query->where('business_id', $businessId);
    }
 
    public function scopeCustomers($query)
    {
        return $query->where('party_type', 'customer');
    }
 
    public function scopeSuppliers($query)
    {
        return $query->where('party_type', 'supplier');
    }

    // ── Accessors ─────────────────────────────────────────────────────────────
 
    public function getTypeLabelAttribute(): string
    {
        return ucfirst($this->party_type ?? 'customer');
    }
 
    public function getInitialAttribute(): string
    {
        return strtoupper(substr($this->name ?? '?', 0, 1));
    }
}
