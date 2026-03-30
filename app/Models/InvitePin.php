<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;

class InvitePin extends Model
{
    protected $fillable = [
        'pin',
        'pin_hash',
        'label',
        'is_active',
        'max_uses',
        'used_count',
        'expires_at',
        'created_by',
    ];

    protected $casts = [
        'is_active'  => 'boolean',
        'expires_at' => 'datetime',
    ];

    protected $hidden = ['pin', 'pin_hash'];

    // -----------------------------------------------------------------------
    // Scopes
    // -----------------------------------------------------------------------

    public function scopeActive($query)
    {
        return $query->where('is_active', true)
                     ->where(function ($q) {
                         $q->whereNull('expires_at')
                           ->orWhere('expires_at', '>', now());
                     });
    }

    // -----------------------------------------------------------------------
    // Helpers
    // -----------------------------------------------------------------------

    /**
     * Verify a raw PIN string against all active invite PINs.
     * Returns the matching InvitePin record or null.
     */
    public static function verify(string $rawPin): ?self
    {
        // Load only active PINs and check each hash — avoids timing leaks
        // from a single DB equality check on a hashed value.
        $candidates = self::active()->get();

        foreach ($candidates as $record) {
            if (Hash::check($rawPin, $record->pin_hash)) {
                // Enforce per-PIN usage cap
                if ($record->max_uses > 0 && $record->used_count >= $record->max_uses) {
                    return null;
                }
                return $record;
            }
        }

        return null;
    }

    /** Increment usage counter (call after successful auth). */
    public function incrementUsage(): void
    {
        $this->increment('used_count');
    }

    public function isExhausted(): bool
    {
        return $this->max_uses > 0 && $this->used_count >= $this->max_uses;
    }
}