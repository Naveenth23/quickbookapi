<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuthPin;
use App\Models\Business;
use App\Models\InvitePin;
use App\Models\User;
use App\Models\UserSocialAccount;
use App\Services\AuthPinService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function __construct(private readonly AuthPinService $pinService) {}

    // =========================================================================
    // INVITE PIN — server-side validation endpoint
    // =========================================================================

    /**
     * POST /auth/verify-invite-pin
     * Validate an invite PIN before showing the registration / social-auth form.
     * Returns a short-lived signed token the client echoes back on the next call.
     *
     * Body: { pin }
     */
    public function verifyInvitePin(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'pin' => 'required|string|max:10',
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $invitePin = InvitePin::verify($request->pin);

        if (! $invitePin) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired access PIN.',
            ], 401);
        }

        $sessionToken = Str::random(64);

        cache()->put(
            "invite_session_{$sessionToken}",
            ['invite_pin_id' => $invitePin->id, 'verified_at' => now()->toISOString()],
            now()->addMinutes(30)
        );

        return response()->json([
            'success'       => true,
            'message'       => 'PIN verified.',
            'session_token' => $sessionToken,
        ]);
    }

    // =========================================================================
    // REGISTER
    // =========================================================================

    /**
     * POST /auth/register
     * Classic email + password registration.
     */
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name'           => 'required|string|max:255',
            'email'          => 'required|string|email|max:255|unique:users',
            'password'       => 'required|min:6',
            'phone'          => 'nullable|string|max:20',
            'business_name'  => 'required|string|max:255',
            'business_type'  => 'required|string|max:100',
            'invite_session' => 'required|string|size:64',
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        [$valid, $invitePin] = $this->resolveInviteSession($request->invite_session);
        if (! $valid) {
            return response()->json(['success' => false, 'message' => 'Invalid or expired invite session.'], 401);
        }

        try {
            DB::beginTransaction();

            $user = User::create([
                'name'     => $request->name,
                'email'    => $request->email,
                'phone'    => $request->phone,
                'password' => Hash::make($request->password),
            ]);

            $business = $this->createBusiness($user, $request);

            $user->businesses()->attach($business->id, [
                'role_id'          => 1,
                'is_active'        => true,
                'assigned_by_type' => 'system',
                'assigned_by_id'   => 0,
            ]);

            $invitePin?->incrementUsage();
            $this->revokeInviteSession($request->invite_session);

            $token = $user->createToken('auth_token')->plainTextToken;
            DB::commit();

            return $this->authResponse($user->load('businesses'), $token, 'User registered successfully.', 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->serverError('Registration failed', $e);
        }
    }

    // -------------------------------------------------------------------------

    /**
     * POST /auth/register-mobile-pin
     * Step 1 — validate invite session, send OTP to phone.
     *
     * Body: { phone, name, business_name, business_type, invite_session }
     */
    public function registerMobilePin(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'phone'          => 'required|string|max:20|unique:users,phone',
            'name'           => 'required|string|max:255',
            'business_name'  => 'required|string|max:255',
            'business_type'  => 'required|string|max:100',
            'invite_session' => 'required|string|size:64',
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        [$valid] = $this->resolveInviteSession($request->invite_session);
        if (! $valid) {
            return response()->json(['success' => false, 'message' => 'Invalid or expired invite session.'], 401);
        }

        $otp = $this->pinService->generate($request->phone, 'mobile', 'register', $request->ip());

        // TODO: SendSmsOtp::dispatch($request->phone, $otp);

        cache()->put(
            "register_meta_{$request->phone}",
            array_merge(
                $request->only('name', 'business_name', 'business_type', 'email', 'country', 'currency', 'timezone'),
                ['invite_session' => $request->invite_session]
            ),
            now()->addMinutes(15)
        );

        return response()->json([
            'success'   => true,
            'message'   => 'OTP sent to your mobile number.',
            'debug_otp' => app()->isLocal() ? $otp : null,
        ]);
    }

    // -------------------------------------------------------------------------

    /**
     * POST /auth/register-email-pin
     * Step 1 — validate invite session, send OTP to email.
     *
     * Body: { email, name, business_name, business_type, invite_session }
     */
    public function registerEmailPin(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email'          => 'required|string|email|max:255|unique:users',
            'name'           => 'required|string|max:255',
            'business_name'  => 'required|string|max:255',
            'business_type'  => 'required|string|max:100',
            'invite_session' => 'required|string|size:64',
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        [$valid] = $this->resolveInviteSession($request->invite_session);
        if (! $valid) {
            return response()->json(['success' => false, 'message' => 'Invalid or expired invite session.'], 401);
        }

        $otp = $this->pinService->generate($request->email, 'email', 'register', $request->ip());

        // TODO: SendEmailOtp::dispatch($request->email, $otp);

        cache()->put(
            "register_meta_{$request->email}",
            array_merge(
                $request->only('name', 'business_name', 'business_type', 'phone', 'country', 'currency', 'timezone'),
                ['invite_session' => $request->invite_session]
            ),
            now()->addMinutes(15)
        );

        return response()->json([
            'success'   => true,
            'message'   => 'OTP sent to your email address.',
            'debug_otp' => app()->isLocal() ? $otp : null,
        ]);
    }

    // =========================================================================
    // LOGIN
    // =========================================================================

    /**
     * POST /auth/login
     * Classic email + password login.
     */
    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email'    => 'required|string|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json(['success' => false, 'message' => 'Invalid credentials.'], 401);
        }

        $this->touchLastLogin($user, $request->ip());
        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->authResponse($user->load(['businesses', 'roles']), $token, 'Login successful.');
    }

    // -------------------------------------------------------------------------

    /**
     * POST /auth/login-mobile-pin
     * Login via mobile OTP.  No invite session needed for existing users.
     *
     * Body: { phone, otp }
     */
    public function loginMobilePin(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string|max:20',
            'otp'   => 'required|string|size:6',
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $existingUser = User::where('phone', $request->phone)->first();
        $purpose      = $existingUser ? 'login' : 'register';

        $pinRecord = $this->pinService->verify($request->phone, 'mobile', $request->otp, $purpose);

        if (! $pinRecord) {
            return response()->json(['success' => false, 'message' => 'Invalid or expired OTP.'], 401);
        }

        try {
            DB::beginTransaction();

            if ($existingUser) {
                $user    = $existingUser;
                $message = 'Login successful.';
                $status  = 200;
                $this->touchLastLogin($user, $request->ip());
            } else {
                $meta = cache()->pull("register_meta_{$request->phone}") ?? [];

                [$valid, $invitePin] = $this->resolveInviteSession($meta['invite_session'] ?? '');
                if (! $valid) {
                    DB::rollBack();
                    return response()->json(['success' => false, 'message' => 'Invite session expired. Please start over.'], 401);
                }

                $user = User::create([
                    'name'              => $meta['name'] ?? 'User',
                    'phone'             => $request->phone,
                    'email'             => $meta['email'] ?? null,
                    'password'          => Hash::make(Str::random(32)),
                    'phone_verified_at' => now(),
                ]);

                $business = $this->createBusiness($user, new Request($meta));
                $user->businesses()->attach($business->id, ['role_id' => 1, 'is_active' => true, 'assigned_by_type' => 'system', 'assigned_by_id' => 0]);

                $invitePin?->incrementUsage();
                $this->revokeInviteSession($meta['invite_session']);

                $message = 'User registered successfully.';
                $status  = 201;
            }

            $token = $user->createToken('auth_token')->plainTextToken;
            DB::commit();

            return $this->authResponse($user->load('businesses'), $token, $message, $status);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->serverError('Authentication failed', $e);
        }
    }

    // -------------------------------------------------------------------------

    /**
     * POST /auth/login-email-pin
     * Login via email OTP.
     *
     * Body: { email, otp }
     */
    public function loginEmailPin(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'otp'   => 'required|string|size:6',
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $existingUser = User::where('email', $request->email)->first();
        $purpose      = $existingUser ? 'login' : 'register';

        $pinRecord = $this->pinService->verify($request->email, 'email', $request->otp, $purpose);

        if (! $pinRecord) {
            return response()->json(['success' => false, 'message' => 'Invalid or expired OTP.'], 401);
        }

        try {
            DB::beginTransaction();

            if ($existingUser) {
                $user = $existingUser;
                if (! $user->email_verified_at) $user->update(['email_verified_at' => now()]);
                $this->touchLastLogin($user, $request->ip());
                $message = 'Login successful.';
                $status  = 200;
            } else {
                $meta = cache()->pull("register_meta_{$request->email}") ?? [];

                [$valid, $invitePin] = $this->resolveInviteSession($meta['invite_session'] ?? '');
                if (! $valid) {
                    DB::rollBack();
                    return response()->json(['success' => false, 'message' => 'Invite session expired. Please start over.'], 401);
                }

                $user = User::create([
                    'name'              => $meta['name'] ?? 'User',
                    'email'             => $request->email,
                    'phone'             => $meta['phone'] ?? null,
                    'password'          => Hash::make(Str::random(32)),
                    'email_verified_at' => now(),
                ]);

                $business = $this->createBusiness($user, new Request($meta));
                $user->businesses()->attach($business->id, ['role_id' => 1, 'is_active' => true, 'assigned_by_type' => 'system', 'assigned_by_id' => 0]);

                $invitePin?->incrementUsage();
                $this->revokeInviteSession($meta['invite_session']);

                $message = 'User registered successfully.';
                $status  = 201;
            }

            $token = $user->createToken('auth_token')->plainTextToken;
            DB::commit();

            return $this->authResponse($user->load('businesses'), $token, $message, $status);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->serverError('Authentication failed', $e);
        }
    }

    // =========================================================================
    // SOCIAL AUTH
    // =========================================================================

    /**
     * POST /auth/facebook
     * Authenticate or register via Facebook access token.
     * New users must supply invite_session.
     *
     * Body: { access_token, invite_session? }
     */
    public function facebookAuth(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'access_token'   => 'required|string',
            'invite_session' => 'nullable|string|size:64',
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        try {
            $fbUser = $this->fetchFacebookUser($request->access_token);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Invalid Facebook token.', 'error' => $e->getMessage()], 401);
        }

        try {
            DB::beginTransaction();

            $socialAccount = UserSocialAccount::where('provider', 'facebook')
                                              ->where('provider_id', $fbUser['id'])
                                              ->with('user')->first();

            if ($socialAccount) {
                $user = $socialAccount->user;
                $socialAccount->update(['access_token' => $request->access_token, 'raw_data' => $fbUser]);
                $message = 'Login successful.';
                $status  = 200;
            } else {
                [$valid, $invitePin] = $this->resolveInviteSession($request->invite_session ?? '');
                if (! $valid) {
                    DB::rollBack();
                    return response()->json(['success' => false, 'message' => 'A valid invite PIN is required to create a new account.'], 401);
                }

                $user = $fbUser['email'] ? User::where('email', $fbUser['email'])->first() : null;

                if (! $user) {
                    $user = User::create([
                        'name'              => $fbUser['name'],
                        'email'             => $fbUser['email'] ?? null,
                        'password'          => Hash::make(Str::random(32)),
                        'avatar'            => $fbUser['picture']['data']['url'] ?? null,
                        'email_verified_at' => $fbUser['email'] ? now() : null,
                    ]);

                    $business = Business::create([
                        'name'          => $fbUser['name'] . "'s Business",
                        'business_type' => 'general',
                        'email'         => $fbUser['email'] ?? null,
                        'country'       => 'India',
                        'currency'      => 'INR',
                        'timezone'      => 'Asia/Kolkata',
                        'is_active'     => true,
                        'owner_id'      => $user->id,
                    ]);

                    $user->businesses()->attach($business->id, ['role_id' => 1, 'is_active' => true, 'assigned_by_type' => 'system', 'assigned_by_id' => 0]);
                }

                UserSocialAccount::create([
                    'user_id'      => $user->id,
                    'provider'     => 'facebook',
                    'provider_id'  => $fbUser['id'],
                    'access_token' => $request->access_token,
                    'raw_data'     => $fbUser,
                ]);

                $invitePin?->incrementUsage();
                $this->revokeInviteSession($request->invite_session);

                $message = 'Account created successfully.';
                $status  = 201;
            }

            $this->touchLastLogin($user, $request->ip());
            $token = $user->createToken('auth_token')->plainTextToken;
            DB::commit();

            return $this->authResponse($user->load('businesses'), $token, $message, $status);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->serverError('Facebook authentication failed', $e);
        }
    }

    // =========================================================================
    // EXISTING METHODS
    // =========================================================================

    public function user(Request $request): JsonResponse
    {
        return response()->json(['success' => true, 'data' => ['user' => $request->user()->load(['businesses', 'roles', 'permissions'])]]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['success' => true, 'message' => 'Logged out successfully.']);
    }

    public function changePassword(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'new_password'     => 'required|string|min:8|confirmed',
        ]);
        if ($validator->fails()) return $this->validationError($validator->errors());

        $user = $request->user();
        if (! Hash::check($request->current_password, $user->password)) {
            return response()->json(['success' => false, 'message' => 'Current password is incorrect.'], 400);
        }
        $user->update(['password' => Hash::make($request->new_password)]);
        return response()->json(['success' => true, 'message' => 'Password changed successfully.']);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name'     => 'required|string|max:255',
            'phone'    => 'nullable|string|max:20',
            'avatar'   => 'nullable|string|max:255',
            'timezone' => 'nullable|string|max:50',
            'language' => 'nullable|string|max:10',
        ]);
        if ($validator->fails()) return $this->validationError($validator->errors());

        $user = $request->user();
        $user->update($request->only(['name', 'phone', 'avatar', 'timezone', 'language']));
        return response()->json(['success' => true, 'message' => 'Profile updated successfully.', 'data' => ['user' => $user]]);
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), ['email' => 'required|string|email']);
        if ($validator->fails()) return $this->validationError($validator->errors());

        $status = Password::sendResetLink($request->only('email'));
        return $status === Password::RESET_LINK_SENT
            ? response()->json(['success' => true, 'message' => 'Password reset link sent.'])
            : response()->json(['success' => false, 'message' => 'Unable to send reset link.'], 400);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'token'    => 'required',
            'email'    => 'required|string|email',
            'password' => 'required|string|min:8|confirmed',
        ]);
        if ($validator->fails()) return $this->validationError($validator->errors());

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill(['password' => Hash::make($password)])->setRememberToken(Str::random(60));
                $user->save();
                event(new PasswordReset($user));
            }
        );

        return $status === Password::PASSWORD_RESET
            ? response()->json(['success' => true, 'message' => 'Password reset successfully.'])
            : response()->json(['success' => false, 'message' => 'Invalid token or email.'], 400);
    }

    // =========================================================================
    // PRIVATE HELPERS
    // =========================================================================

    /** @return array{0: bool, 1: \App\Models\InvitePin|null} */
    private function resolveInviteSession(string $token): array
    {
        if (empty($token)) return [false, null];

        $data = cache()->get("invite_session_{$token}");
        if (! $data) return [false, null];

        $invitePin = InvitePin::active()->find($data['invite_pin_id']);
        if (! $invitePin || $invitePin->isExhausted()) return [false, null];

        return [true, $invitePin];
    }

    private function revokeInviteSession(string $token): void
    {
        cache()->forget("invite_session_{$token}");
    }

    private function createBusiness(User $user, Request $request): Business
    {
        return Business::create([
            'name'          => $request->input('business_name', $user->name . "'s Business"),
            'business_type' => $request->input('business_type', 'general'),
            'email'         => $user->email,
            'phone'         => $user->phone,
            'country'       => $request->input('country', 'India'),
            'currency'      => $request->input('currency', 'INR'),
            'timezone'      => $request->input('timezone', 'Asia/Kolkata'),
            'is_active'     => true,
            'owner_id'      => $user->id,
        ]);
    }

    private function touchLastLogin(User $user, ?string $ip): void
    {
        $user->update(['last_login_at' => now(), 'last_login_ip' => $ip]);
    }

    private function authResponse(User $user, string $token, string $message, int $status = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data'    => ['user' => $user, 'token' => $token, 'token_type' => 'Bearer'],
        ], $status);
    }

    private function validationError($errors): JsonResponse
    {
        return response()->json(['success' => false, 'message' => 'Validation errors.', 'errors' => $errors], 422);
    }

    private function serverError(string $message, \Exception $e): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'error'   => app()->isLocal() ? $e->getMessage() : 'An unexpected error occurred.',
        ], 500);
    }

    private function fetchFacebookUser(string $accessToken): array
    {
        $fields   = 'id,name,email,picture';
        $url      = "https://graph.facebook.com/me?fields={$fields}&access_token={$accessToken}";
        $response = @file_get_contents($url);
        if ($response === false) throw new \RuntimeException('Could not reach Facebook Graph API.');

        $data = json_decode($response, true);
        if (isset($data['error'])) throw new \RuntimeException($data['error']['message'] ?? 'Facebook error.');
        return $data;
    }
}