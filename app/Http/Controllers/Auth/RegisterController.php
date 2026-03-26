<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use App\Models\Business;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name'       => 'required',
            'email'      => 'required|email|unique:users,email',
            'phone'      => 'required|unique:users,phone',
            'password'   => 'required|min:6',
            'business'   => 'required|string'
        ]);
        

        $business = Business::create(['name' => $request->business]);

        $user = User::create([
            'name' => $request->name,
            'email'=> $request->email,
            'phone'=> $request->phone,
            'password' => Hash::make($request->password),
            'role' => 'owner',
            'business_id' => $business->id
        ]);

        $token = $user->createToken('authToken')->plainTextToken;

        return response()->json([
            'message' => 'Registered Successfully!',
            'business_id' => $business->id,
            'token' => $token
        ], 201);
    }
}
