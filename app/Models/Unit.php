<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Unit extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'slug',
        'short_name',
        'description',
        'unit_type',
        'base_unit_id',
        'conversion_factor',
        'decimal_places',
        'is_active',
        'is_base_unit',
        'custom_fields',
        'business_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'conversion_factor' => 'decimal:6',
        'decimal_places' => 'integer',
        'is_active' => 'boolean',
        'is_base_unit' => 'boolean',
        'custom_fields' => 'array',
    ];

    /**
     * Get the business that owns the unit.
     */
    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    /**
     * Get the base unit this unit is derived from.
     */
    public function baseUnit(): BelongsTo
    {
        return $this->belongsTo(Unit::class, 'base_unit_id');
    }

    /**
     * Get the units derived from this base unit.
     */
    public function convertedUnits(): HasMany
    {
        return $this->hasMany(Unit::class, 'base_unit_id');
    }

    /**
     * Get the products for the unit.
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Scope active units.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope base units.
     */
    public function scopeBaseUnits($query)
    {
        return $query->where('is_base_unit', true);
    }

    /**
     * Convert a given quantity to its base unit equivalent.
     */
    public function toBaseUnit(float $quantity): float
    {
        return $this->is_base_unit
            ? $quantity
            : $quantity * ($this->conversion_factor ?: 1);
    }

    /**
     * Convert a base unit quantity to this unit.
     */
    public function fromBaseUnit(float $baseQuantity): float
    {
        return $this->is_base_unit
            ? $baseQuantity
            : $baseQuantity / ($this->conversion_factor ?: 1);
    }
}
