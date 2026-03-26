<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'avatar',
        'timezone',
        'language',
        'is_active',
        'email_verified_at',
        'last_login_at',
        'last_login_ip',
        'two_factor_secret',
        'two_factor_enabled',
        'custom_fields',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'last_login_at' => 'datetime',
            'is_active' => 'boolean',
            'two_factor_enabled' => 'boolean',
            'custom_fields' => 'array',
        ];
    }

    /**
     * Get the roles for the user.
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'user_roles')
            ->withPivot('is_active', 'expires_at', 'conditions', 'restrictions', 'assigned_by_type', 'assigned_by_id', 'notes')
            ->withTimestamps();
    }


    public function hasRole($roles)
    {
        $userRoles = $this->roles()->pluck('slug')->toArray();

        if (is_array($roles)) {
            return count(array_intersect($userRoles, $roles)) > 0;
        }

        return in_array($roles, $userRoles);
    }

    /**
     * Get the businesses for the user.
     */


    /**
     * Get the orders created by the user.
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class, 'created_by');
    }

    /**
     * Get the purchases created by the user.
     */
    public function purchases(): HasMany
    {
        return $this->hasMany(Purchase::class, 'created_by');
    }

    /**
     * Get the estimates created by the user.
     */
    public function estimates(): HasMany
    {
        return $this->hasMany(Estimate::class, 'created_by');
    }

    /**
     * Get the expenses created by the user.
     */
    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class, 'created_by');
    }

    /**
     * Get the payments received by the user.
     */
    public function paymentsReceived(): HasMany
    {
        return $this->hasMany(Payment::class, 'received_by');
    }

    /**
     * Check if user has a specific permission.
     */
    public function hasPermission(string $permission): bool
    {
        return $this->roles()
            ->where('is_active', true)
            ->whereHas('permissions', function ($query) use ($permission) {
                $query->where('slug', $permission)
                    ->where('is_active', true)
                    ->where('can_view', true);
            })
            ->exists();
    }

    /**
     * Check if user has any of the given permissions.
     */
    public function hasAnyPermission(array $permissions): bool
    {
        return $this->roles()
            ->where('is_active', true)
            ->whereHas('permissions', function ($query) use ($permissions) {
                $query->whereIn('slug', $permissions)
                    ->where('is_active', true)
                    ->where('can_view', true);
            })
            ->exists();
    }

    /**
     * Check if user has all of the given permissions.
     */
    public function hasAllPermissions(array $permissions): bool
    {
        foreach ($permissions as $permission) {
            if (!$this->hasPermission($permission)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Check if user is active.
     */
    public function isActive(): bool
    {
        return $this->is_active && $this->email_verified_at !== null;
    }

    public function businesses()
    {
        return $this->belongsToMany(Business::class, 'user_businesses')
            ->withPivot(['role_id', 'is_active', 'assigned_by_id', 'assigned_by_type', 'joined_at'])
            ->withTimestamps();
    }

    /**
     * Optional: Get the current active business (if you store session or default business).
     */
    public function currentBusiness()
    {
        return $this->businesses()->wherePivot('is_active', true)->first();
    }
}
