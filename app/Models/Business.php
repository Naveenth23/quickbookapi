<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Business extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'name',
        'slug',
        'description',
        'logo',
        'signature',
        'website',
        'email',
        'phone',
        'alternate_phone',
        'fax',
        'address',
        'city',
        'state',
        'country',
        'zip_code',
        'gstin',
        'pan',
        'tan',
        'cin',
        'business_type',
        'industry_type',
        'established_date',
        'currency',
        'timezone',
        'language',
        'fiscal_year_start',
        'fiscal_year_end',
        'tax_regime',
        'is_gst_registered',
        'enable_e_invoice',
        'gst_registration_type',
        'is_active',
        'metadata',
        'custom_fields',
        'owner_id',
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
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'established_date' => 'date',
        'fiscal_year_start' => 'date',
        'fiscal_year_end' => 'date',
        'is_active' => 'boolean',
        'is_gst_registered' => 'boolean',
        'metadata' => 'array',
        'custom_fields' => 'array',
        'business_type' => 'array',
    ];


    /**
     * Relationships
     */

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_businesses')
            ->withPivot('role_id', 'is_active', 'joined_at', 'assigned_by_id', 'assigned_by_type')
            ->withTimestamps();
    }
    public function categories()
    {
        return $this->belongsToMany(
            \App\Models\Category::class,
            'business_category',
            'business_id',
            'category_id'
        );
    }

    public function brands(): HasMany
    {
        return $this->hasMany(Brand::class);
    }

    public function units(): HasMany
    {
        return $this->hasMany(Unit::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function customers(): HasMany
    {
        return $this->hasMany(Customer::class);
    }

    public function suppliers(): HasMany
    {
        return $this->hasMany(Supplier::class);
    }

    public function expenseCategories(): HasMany
    {
        return $this->hasMany(ExpenseCategory::class);
    }

    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function purchases(): HasMany
    {
        return $this->hasMany(Purchase::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function estimates(): HasMany
    {
        return $this->hasMany(Estimate::class);
    }

    public function roles(): HasMany
    {
        return $this->hasMany(Role::class);
    }

    public function permissions(): HasMany
    {
        return $this->hasMany(Permission::class);
    }

    public function userRoles(): HasMany
    {
        return $this->hasMany(UserRole::class);
    }
}
