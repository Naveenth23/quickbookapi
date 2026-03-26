<?php
namespace App\Http\Controllers;

use App\Models\User;
use App\Models\StaffInvitation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class StaffInviteController extends Controller
{
    // ⬇ OWNER sends invitation
    public function invite(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);
        $owner = $request->user();
        
        if ($owner->role !== 'owner') {
            return response()->json(['message' => 'Only Owner can invite'], 403);
        }

        if (User::where('email', $request->email)->exists()) {
            return response()->json(['message' => 'User already exists'], 422);
        }

        $token = Str::random(40);

        $invite = StaffInvitation::create([
            'business_id' => $owner->business_id,
            'invited_by'  => $owner->id,
            'email'       => $request->email,
            'token'       => $token,
        ]);

        return response()->json([
            'message' => 'Invitation created successfully',
            'invite_link' => url("/api/accept-invite/".$token)
        ]);
    }

    // ⬇ Staff accepts invitation
    public function accept(Request $request, $token)
    {
        $invite = StaffInvitation::where('token', $token)
            ->where('accepted', false)
            ->first();

        if (! $invite) {
            return response()->json(['message' => 'Invalid or expired link'], 404);
        }

        $request->validate([
            'name'     => 'required',
            'password' => 'required|min:6'
        ]);

        $user = User::create([
            'name'        => $request->name,
            'email'       => $invite->email,
            'password'    => Hash::make($request->password),
            'business_id' => $invite->business_id,
            'role'        => 'staff'
        ]);

        $invite->update(['accepted' => true]);

        $token = $user->createToken('authToken')->plainTextToken;

        return response()->json([
            'message' => 'Staff account created!',
            'token' => $token
        ]);
    }
}
