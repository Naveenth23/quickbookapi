<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PurchaseItem extends Model
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
        'received_quantity',
        'return_quantity',
        'return_amount',
        'purchase_id',
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
            'received_quantity' => 'decimal:3',
            'return_quantity' => 'decimal:3',
            'return_amount' => 'decimal:2',
            'attributes' => 'array',
        ];
    }

    /**
     * Get the purchase that owns the purchase item.
     */
    public function purchase(): BelongsTo
    {
        return $this->belongsTo(Purchase::class);
    }

    /**
     * Get the product that owns the purchase item.
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

    /**
     * Check if item is returned.
     */
    public function isReturned(): bool
    {
        return $this->return_quantity > 0;
    }

    /**
     * Get pending quantity to receive.
     */
    public function getPendingQuantityAttribute(): float
    {
        return $this->quantity - $this->received_quantity;
    }

    /**
     * Check if item is fully received.
     */
    public function isFullyReceived(): bool
    {
        return $this->received_quantity >= $this->quantity;
    }

    /**
     * Get return percentage.
     */
    public function getReturnPercentageAttribute(): float
    {
        if ($this->quantity > 0) {
            return ($this->return_quantity / $this->quantity) * 100;
        }
        return 0;
    }
}