<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'color',
        'icon',
        'image',
        'parent_id',
        'sort_order',
        'is_active',
        'is_featured',
        'show_on_pos',
        'show_online',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'custom_fields',
        'business_id',
        'party_type',
        'pan',
        'balance_type'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'show_on_pos' => 'boolean',
        'show_online' => 'boolean',
        'sort_order' => 'integer',
        'custom_fields' => 'array',
    ];

    protected static function booted()
    {
        static::creating(function ($category) {
            if (empty($category->slug)) {
                $category->slug = Str::slug($category->name);

                $original = $category->slug;
                $count = 1;

                while (
                    static::where('slug', $category->slug)
                        ->when($category->business_id, fn ($q) => $q->where('business_id', $category->business_id))
                        ->exists()
                ) {
                    $category->slug = $original . '-' . $count++;
                }
            }
        });
    }

    /**
     * Get the business that owns the category.
     */
    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    public function businesses()
    {
        return $this->belongsToMany(
            \App\Models\Business::class,
            'business_category',
            'category_id',
            'business_id'
        );
    }
    /**
     * Get the parent category.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    /**
     * Get the child categories.
     */
    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    /**
     * Get the products for the category.
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Get the products that belong to the category (many-to-many).
     */
    public function allProducts(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'product_categories');
    }

    /**
     * Scope active categories.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope featured categories.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope POS categories.
     */
    public function scopePos($query)
    {
        return $query->where('show_on_pos', true);
    }

    /**
     * Get all descendant categories recursively.
     */
    public function descendants(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id')->with('descendants');
    }

    /**
     * Get all ancestor categories recursively.
     */
    public function ancestors()
    {
        $ancestors = collect();
        $parent = $this->parent;

        while ($parent) {
            $ancestors->push($parent);
            $parent = $parent->parent;
        }

        return $ancestors;
    }
}
