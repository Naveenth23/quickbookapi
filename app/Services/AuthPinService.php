<?php

namespace App\Services;

use App\Models\AuthPin;
use Illuminate\Support\Facades\Hash;

class AuthPinService
{
    private const PIN_TTL_MINUTES  = 10;
    private const PIN_LENGTH       = 6;
    private const MAX_ATTEMPTS     = 5;

    // -----------------------------------------------------------------------
    // Generate & persist a new PIN
    // -----------------------------------------------------------------------

    public function generate(
        string $identifier,
        string $type,       // 'mobile' | 'email'
        string $purpose = 'login',
        ?string $ip = null
    ): string {
        // Invalidate any existing un-used PINs for the same slot
        AuthPin::forIdentifier($identifier, $type, $purpose)
               ->valid()
               ->update(['is_used' => true]);

        $pin = $this->makePin();

        AuthPin::create([
            'identifier' => $identifier,
            'type'       => $type,
            'purpose'    => $purpose,
            'pin'        => Hash::make($pin),
            'expires_at' => now()->addMinutes(self::PIN_TTL_MINUTES),
            'ip_address' => $ip,
        ]);

        return $pin;
    }

    // -----------------------------------------------------------------------
    // Verify a PIN supplied by the user
    // Returns the AuthPin record on success, null on failure
    // -----------------------------------------------------------------------

    public function verify(
        string $identifier,
        string $type,
        string $pin,
        string $purpose = 'login'
    ): ?AuthPin {
        /** @var AuthPin|null $record */
        $record = AuthPin::forIdentifier($identifier, $type, $purpose)
                         ->valid()
                         ->latest()
                         ->first();

        if (! $record) {
            return null;
        }

        if ($record->isMaxAttemptsReached(self::MAX_ATTEMPTS)) {
            return null;
        }

        if (! $record->verifyPin($pin)) {
            $record->incrementAttempts();
            return null;
        }

        $record->markUsed();

        return $record;
    }

    // -----------------------------------------------------------------------
    // Internal helpers
    // -----------------------------------------------------------------------

    private function makePin(): string
    {
        return str_pad(
            (string) random_int(0, (int) str_repeat('9', self::PIN_LENGTH)),
            self::PIN_LENGTH,
            '0',
            STR_PAD_LEFT
        );
    }
}