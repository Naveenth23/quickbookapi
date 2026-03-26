<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Traits\BelongsToBusiness;
use App\Traits\HasUuid;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory;
    use HasUuid, BelongsToBusiness;
    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'name',
        'sku',
        'barcode',
        'hsn_code',
        'description',
        'purchase_price',
        'sale_price',
        'wholesale_price',
        'mrp',
        'stock_quantity',
        'as_of_date',
        'min_stock_level',
        'max_stock_level',
        'low_stock_enabled',
        'tax_rate',
        'tax_type',
        'discount_percent',
        'discount_type',
        'track_inventory',
        'is_active',
        'is_featured',
        'image',
        'gallery',
        'attributes',
        'weight',
        'dimensions',
        'business_id',
        'category_id',
        'brand_id',
        'unit_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'purchase_price' => 'float',
        'sale_price' => 'float',
        'mrp' => 'float',
        'wholesale_price' => 'float',
        'cost_price' => 'float',
        'tax_rate' => 'float',
        'weight' => 'float',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->uuid = Str::uuid();
            $model->slug = Str::slug($model->name) . '-' . Str::random(4);
        });
    }

    /**
     * Get the business that owns the product.
     */
    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    /**
     * Get the category that owns the product.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the brand that owns the product.
     */
    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    /**
     * Get the unit that owns the product.
     */
    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    /**
     * Get the order items for the product.
     */
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Get the purchase items for the product.
     */
    public function purchaseItems(): HasMany
    {
        return $this->hasMany(PurchaseItem::class);
    }

    /**
     * Get the estimate items for the product.
     */
    public function estimateItems(): HasMany
    {
        return $this->hasMany(EstimateItem::class);
    }

    /**
     * Get the categories for the product.
     */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'product_categories');
    }

    /**
     * Scope active products.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope featured products.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope POS products.
     */
    public function scopePos($query)
    {
        return $query->where('show_on_pos', true);
    }

    /**
     * Scope products by category.
     */
    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    /**
     * Scope products by brand.
     */
    public function scopeByBrand($query, $brandId)
    {
        return $query->where('brand_id', $brandId);
    }

    /**
     * Calculate profit margin percentage.
     */
    public function getProfitMarginAttribute(): float
    {
        if ($this->purchase_price > 0) {
            return round((($this->sale_price - $this->purchase_price) / $this->purchase_price) * 100, 2);
        }

        return 0.0;
    }

    /**
     * Check if product is in stock.
     */
    public function isInStock(): bool
    {
        if (!$this->track_inventory) {
            return true;
        }

        return ($this->stock_quantity ?? 0) > 0;
    }

    /**
     * Check if product needs reorder.
     */
    public function needsReorder(): bool
    {
        if (!$this->track_inventory) {
            return false;
        }

        return ($this->stock_quantity ?? 0) <= ($this->reorder_level ?? 0);
    }
}
