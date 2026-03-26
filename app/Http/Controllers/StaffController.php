<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class StaffController extends Controller
{
    public function index(Request $request)
    {
        $owner = $request->user();

        $staff = User::where('business_id', $owner->business_id)
            ->where('role', 'staff')
            ->get(['id', 'name', 'email', 'phone', 'role', 'created_at']);

        return response()->json($staff);
    }

    public function update(Request $request, $id)
    {
        $owner = $request->user();

        $staff = User::where('id', $id)
            ->where('business_id', $owner->business_id)
            ->where('role', 'staff')
            ->firstOrFail();

        $request->validate([
            'name' => 'sometimes|string',
            'phone' => 'sometimes|string|unique:users,phone,'.$staff->id,
            'role' => 'sometimes|in:staff' // owner can't change role to admin/owner
        ]);

        $staff->update($request->all());

        return response()->json(['message' => 'Staff updated successfully']);
    }

    public function destroy(Request $request, $id)
    {
        $owner = $request->user();

        $staff = User::where('id', $id)
            ->where('business_id', $owner->business_id)
            ->where('role', 'staff')
            ->firstOrFail();

        $staff->delete();

        return response()->json(['message' => 'Staff removed successfully']);
    }
}
