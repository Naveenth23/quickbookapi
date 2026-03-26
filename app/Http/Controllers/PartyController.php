<?php

namespace App\Http\Controllers;

use App\Models\Party;
use Illuminate\Http\Request;

class PartyController extends Controller
{
    // List (filter: customer/vendor)
    public function index(Request $request)
    {
        $request->validate([
            'type' => 'nullable|in:customer,vendor'
        ]);

        $user = $request->user(); // must be App\Models\User instance
        $businessId = $user->business_id;
        $type = $request->type ?? 'customer';
        $search = $request->search;

        $parties = Party::where('business_id', $businessId)
            ->where('type', $type)
            ->when($search, function ($q) use ($search) {
                $q->where('name', 'LIKE', "%$search%");
            })
            ->orderBy('name')
            ->get(['id', 'name', 'phone', 'type']);

        return response()->json(['data' => $parties]);
    }

    // Create
    public function store(Request $request)
    {
        $request->validate([
            'type'  => 'required|in:customer,vendor',
            'name'  => 'required',
        ]);

        $party = Party::create([
            'business_id' => $request->user()->business_id,
            'type'        => $request->type,
            'name'        => $request->name,
            'phone'       => $request->phone,
            'gst_number'  => $request->gst_number,
            'address'     => $request->address,
            'opening_balance' => $request->opening_balance,
        ]);

        return response()->json([
            'message' => 'Party created successfully',
            'data'    => $party
        ], 201);
    }

    // View
    public function show($id)
    {
        return Party::findOrFail($id);
    }

    // Update
    public function update(Request $request, $id)
    {
        $party = Party::where('id', $id)
            ->where('business_id', $request->user()->business_id)
            ->firstOrFail();

        $request->validate([
            'type'  => 'in:customer,vendor'
        ]);

        $party->update($request->all());

        return response()->json(['message' => 'Updated successfully']);
    }

    // Delete
    public function destroy($id)
    {
        Party::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
