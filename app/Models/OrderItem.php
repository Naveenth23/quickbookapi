<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
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
        'return_quantity',
        'return_amount',
        'order_id',
        'product_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'quantity'         => 'decimal:3',
        'unit_price'       => 'decimal:2',
        'discount_amount'  => 'decimal:2',
        'discount_percent' => 'decimal:2',
        'tax_amount'       => 'decimal:2',
        'cgst_amount'      => 'decimal:2',
        'sgst_amount'      => 'decimal:2',
        'igst_amount'      => 'decimal:2',
        'cess_amount'      => 'decimal:2',
        'subtotal'         => 'decimal:2',
        'total'            => 'decimal:2',
        'return_quantity'  => 'decimal:3',
        'return_amount'    => 'decimal:2',
        'attributes'       => 'array',
    ];

    /**
     * Relationships
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Accessors & Computed Attributes
     */

    /**
     * Get total tax amount for this item.
     */
    public function getTotalTaxAttribute(): float
    {
        return (float) (
            ($this->cgst_amount ?? 0) +
            ($this->sgst_amount ?? 0) +
            ($this->igst_amount ?? 0) +
            ($this->cess_amount ?? 0)
        );
    }

    /**
     * Get net amount (subtotal - discount).
     */
    public function getNetAmountAttribute(): float
    {
        return (float) (($this->subtotal ?? 0) - ($this->discount_amount ?? 0));
    }

    /**
     * Determine if this item has been returned.
     */
    public function isReturned(): bool
    {
        return ($this->return_quantity ?? 0) > 0;
    }

    /**
     * Get return percentage of the item.
     */
    public function getReturnPercentageAttribute(): float
    {
        if (($this->quantity ?? 0) > 0) {
            return round((($this->return_quantity ?? 0) / $this->quantity) * 100, 2);
        }
        return 0.0;
    }
}
