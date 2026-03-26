<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EstimateItem extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'item_type',
        'name',
        'sku',
        'description',
        'quantity',
        'unit',
        'unit_price',
        'discount_amount',
        'discount_percent',
        'tax_amount',
        'cgst_amount',
        'sgst_amount',
        'igst_amount',
        'cess_amount',
        'subtotal',
        'total',
        'hsn_code',
        'tax_type',
        'attributes',
        'estimate_id',
        'product_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts(): array
    {
        return [
            'quantity' => 'decimal:3',
            'unit_price' => 'decimal:2',
            'discount_amount' => 'decimal:2',
            'discount_percent' => 'decimal:2',
            'tax_amount' => 'decimal:2',
            'cgst_amount' => 'decimal:2',
            'sgst_amount' => 'decimal:2',
            'igst_amount' => 'decimal:2',
            'cess_amount' => 'decimal:2',
            'subtotal' => 'decimal:2',
            'total' => 'decimal:2',
            'attributes' => 'array',
        ];
    }

    /**
     * Get the estimate that owns the estimate item.
     */
    public function estimate(): BelongsTo
    {
        return $this->belongsTo(Estimate::class);
    }

    /**
     * Get the product that owns the estimate item.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
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
}