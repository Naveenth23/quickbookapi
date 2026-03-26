<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Supplier extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'supplier_code',
        'name',
        'email',
        'phone',
        'alternate_phone',
        'company_name',
        'gstin',
        'address',
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
        'is_active',
        'notes',
        'custom_fields',
        'business_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts(): array
    {
        return [
            'opening_balance' => 'decimal:2',
            'current_balance' => 'decimal:2',
            'credit_limit' => 'decimal:2',
            'total_purchases' => 'decimal:2',
            'total_orders' => 'decimal:2',
            'last_order_date' => 'datetime',
            'is_active' => 'boolean',
            'custom_fields' => 'array',
        ];
    }

    /**
     * Get the business that owns the supplier.
     */
    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    /**
     * Get the purchases for the supplier.
     */
    public function purchases(): HasMany
    {
        return $this->hasMany(Purchase::class);
    }

    /**
     * Get the expenses for the supplier.
     */
    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class);
    }

    /**
     * Get the payments for the supplier.
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Get the orders for the supplier.
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Get the full address.
     */
    public function getFullAddressAttribute(): string
    {
        $address = [];
        if ($this->address) {
            $address[] = $this->address;
        }
        if ($this->city) {
            $address[] = $this->city;
        }
        if ($this->state) {
            $address[] = $this->state;
        }
        if ($this->zip_code) {
            $address[] = $this->zip_code;
        }
        if ($this->country) {
            $address[] = $this->country;
        }
        return implode(', ', $address);
    }

    /**
     * Check if supplier has exceeded credit limit.
     */
    public function hasExceededCreditLimit(): bool
    {
        if ($this->credit_limit <= 0) {
            return false;
        }
        return $this->current_balance > $this->credit_limit;
    }

    /**
     * Get available credit.
     */
    public function getAvailableCreditAttribute(): float
    {
        if ($this->credit_limit <= 0) {
            return 0;
        }
        return max(0, $this->credit_limit - $this->current_balance);
    }

    /**
     * Scope active suppliers.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope suppliers with outstanding balance.
     */
    public function scopeWithOutstandingBalance($query)
    {
        return $query->where('current_balance', '>', 0);
    }
}