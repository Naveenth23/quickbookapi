<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;

class AuthPin extends Model
{
    protected $fillable = [
        'identifier',
        'type',
        'pin',
        'purpose',
        'is_used',
        'expires_at',
        'attempts',
        'ip_address',
    ];

    protected $casts = [
        'is_used'    => 'boolean',
        'expires_at' => 'datetime',
    ];

    // -----------------------------------------------------------------------
    // Scopes
    // -----------------------------------------------------------------------

    public function scopeValid($query)
    {
        return $query->where('is_used', false)
                     ->where('expires_at', '>', now());
    }

    public function scopeForIdentifier($query, string $identifier, string $type, string $purpose = 'login')
    {
        return $query->where('identifier', $identifier)
                     ->where('type', $type)
                     ->where('purpose', $purpose);
    }

    // -----------------------------------------------------------------------
    // Helpers
    // -----------------------------------------------------------------------

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    public function isMaxAttemptsReached(int $max = 5): bool
    {
        return $this->attempts >= $max;
    }

    public function verifyPin(string $pin): bool
    {
        return Hash::check($pin, $this->pin);
    }

    public function markUsed(): void
    {
        $this->update(['is_used' => true]);
    }

    public function incrementAttempts(): void
    {
        $this->increment('attempts');
    }
}