<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserSocialAccount extends Model
{
    protected $fillable = [
        'user_id',
        'provider',
        'provider_id',
        'access_token',
        'refresh_token',
        'token_expires_at',
        'raw_data',
    ];

    protected $casts = [
        'raw_data'          => 'array',
        'token_expires_at'  => 'datetime',
    ];

    protected $hidden = ['access_token', 'refresh_token'];

    // -----------------------------------------------------------------------
    // Relationships
    // -----------------------------------------------------------------------

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}