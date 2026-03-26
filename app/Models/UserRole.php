<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class UserRole extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'role_id',
        'business_id',
        'is_active',
        'expires_at',
        'conditions',
        'restrictions',
        'assigned_by_type',
        'assigned_by_id',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active'    => 'boolean',
        'expires_at'   => 'datetime',
        'conditions'   => 'array',
        'restrictions' => 'array',
    ];

    /**
     * Relationships
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    public function assignedBy(): MorphTo
    {
        return $this->morphTo('assigned_by', 'assigned_by_type', 'assigned_by_id');
    }

    /**
     * Scopes
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeExpired($query)
    {
        return $query->where('expires_at', '<', now());
    }

    public function scopeValid($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('expires_at')
              ->orWhere('expires_at', '>', now());
        });
    }

    /**
     * Status helpers
     */
    public function isActive(): bool
    {
        return (bool) $this->is_active;
    }

    public function isExpired(): bool
    {
        return $this->expires_at !== null && $this->expires_at->isPast();
    }

    public function isValid(): bool
    {
        return $this->isActive() && !$this->isExpired();
    }

    public function activate(): void
    {
        $this->update(['is_active' => true]);
    }

    public function deactivate(): void
    {
        $this->update(['is_active' => false]);
    }

    /**
     * Dynamic logic
     */
    public function checkConditions(array $context = []): bool
    {
        if (empty($this->conditions)) {
            return true;
        }

        foreach ($this->conditions as $condition => $requiredValue) {
            if (!array_key_exists($condition, $context) || $context[$condition] !== $requiredValue) {
                return false;
            }
        }

        return true;
    }

    public function isRestricted(string $action, array $context = []): bool
    {
        if (empty($this->restrictions)) {
            return false;
        }

        if (!isset($this->restrictions[$action])) {
            return false;
        }

        $restriction = $this->restrictions[$action];

        // Restriction has conditional logic
        if (isset($restriction['conditions'])) {
            foreach ($restriction['conditions'] as $condition => $forbiddenValue) {
                if (isset($context[$condition]) && $context[$condition] === $forbiddenValue) {
                    return true;
                }
            }
        } else {
            // Global restriction
            return true;
        }

        return false;
    }
}
