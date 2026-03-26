<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
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
        'description',
        'color',
        'is_active',
        'is_system',
        'level',
        'permissions',
        'metadata',
        'business_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active'   => 'boolean',
        'is_system'   => 'boolean',
        'permissions' => 'array',
        'metadata'    => 'array',
    ];

    /**
     * Get the business that owns the role.
     */
    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    /**
     * The users that belong to the role.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_roles')
            ->withPivot('is_active', 'expires_at', 'conditions', 'restrictions', 'assigned_by_type', 'assigned_by_id', 'notes')
            ->withTimestamps();
    }

    /**
     * The permissions that belong to the role.
     */
    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'role_permissions')
            ->withPivot('can_view', 'can_create', 'can_update', 'can_delete', 'conditions', 'restrictions', 'is_active')
            ->withTimestamps();
    }

    /**
     * Get the user roles for the role.
     */
    public function userRoles(): HasMany
    {
        return $this->hasMany(UserRole::class);
    }

    /**
     * Get the role permissions for the role.
     */
    public function rolePermissions(): HasMany
    {
        return $this->hasMany(RolePermission::class);
    }

    /**
     * Check if role has a specific permission.
     */
    public function hasPermission(string $permission): bool
    {
        return $this->permissions()
            ->where('slug', $permission)
            ->wherePivot('is_active', true)
            ->wherePivot('can_view', true)
            ->exists();
    }

    /**
     * Grant permission to role.
     */
    public function grantPermission(Permission $permission, array $abilities = ['can_view' => true]): void
    {
        $this->permissions()->attach($permission->id, $abilities);
    }

    /**
     * Revoke permission from role.
     */
    public function revokePermission(Permission $permission): void
    {
        $this->permissions()->detach($permission->id);
    }
}
