<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Customer;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        // 🔍 Optional search and filters from query string
        $search = $request->input('search');
        $partyType = $request->input('party_type');
        $partyCategory = $request->input('party_category');
        $perPage = $request->input('per_page', 50); // default 10 per page

        // 🧠 Base query
        $query = Customer::query();

        // 🔍 Search across name, phone, email, gstin, pan
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('phone', 'LIKE', "%{$search}%")
                    ->orWhere('email', 'LIKE', "%{$search}%")
                    ->orWhere('gstin', 'LIKE', "%{$search}%")
                    ->orWhere('pan', 'LIKE', "%{$search}%");
            });
        }

        // 🎯 Optional filters
        if ($partyType) {
            $query->where('customer_type', $partyType);
        }

        if ($partyCategory) {
            $query->where('category', $partyCategory);
        }

        // 📊 Paginate results
        $customers = $query->latest()->paginate($perPage);

        // ✅ Return clean JSON
        return response()->json([
            'success' => true,
            'data' => $customers->items(),
            'meta' => [
                'current_page' => $customers->currentPage(),
                'last_page' => $customers->lastPage(),
                'total' => $customers->total(),
                'per_page' => $customers->perPage(),
            ]
        ]);
    }

    public function fetchGST($gstin)
    {
        return response()->json([
            'tradeName' => 'JS TRADING AMB (OPC) PRIVATE LIMITED',
            'principalPlace' => 'Ground Floor, UNA-AMB ROAD, Himachal Pradesh, 177211',
            'city' => 'Una',
            'stateName' => 'Himachal Pradesh',
        ]);
    }

    public function show($id)
    {
        $customer = Customer::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $customer
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email',
            'phone' => 'nullable|string|max:20',
        ]);

        $lastCustomer = Customer::orderBy('id', 'desc')->first();
        $nextId = $lastCustomer ? $lastCustomer->id + 1 : 1;
        $customerCode = 'CUS-' . str_pad($nextId, 4, '0', STR_PAD_LEFT);

        $business = $user->businesses()->wherePivot('is_active', true)->first();

        $customer = Customer::create([
            'customer_code' => $customerCode,
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'alternate_phone' => $request->alternate_phone,
            'company_name' => $request->company_name,
            'gstin' => $request->gstin,

            // ✅ Convert address arrays to JSON strings
            'billing_address' => is_array($request->billing_address)
                ? json_encode($request->billing_address)
                : $request->billing_address,

            'shipping_address' => is_array($request->shipping_address)
                ? json_encode($request->shipping_address)
                : $request->shipping_address,

            'city' => $request->city,
            'state' => $request->state,
            'country' => $request->country ?? 'India',
            'zip_code' => $request->zip_code,

            // ✅ Safe numeric defaults
            'opening_balance' => (float) ($request->opening_balance ?? 0),
            'current_balance' => (float) ($request->opening_balance ?? 0),
            'credit_limit' => (float) ($request->credit_limit ?? 0),
            'payment_terms' => (int) ($request->credit_period ?? 0),

            'customer_type' => $request->party_type ?? 'regular',
            'notes' => $request->notes,

            // ✅ Store custom fields + bank accounts safely
            'custom_fields' => json_encode([
                'birthday' => $request->custom_birthday,
                'drug_license' => $request->custom_drug_license,
                'bank_accounts' => $request->bank_accounts ?? [],
            ]),

            'business_id' => $business->id ?? 1,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Customer created successfully',
            'data' => $customer,
        ]);
    }

    public function update(Request $request, $id)
    {
        $customer = Customer::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email',
            'phone' => 'nullable|string|max:20',
        ]);

        $customer->update([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'alternate_phone' => $request->alternate_phone,
            'company_name' => $request->company_name,
            'gstin' => $request->gstin,

            'billing_address' => is_array($request->billing_address)
                ? json_encode($request->billing_address)
                : $request->billing_address,

            'shipping_address' => is_array($request->shipping_address)
                ? json_encode($request->shipping_address)
                : $request->shipping_address,

            'city' => $request->city,
            'state' => $request->state,
            'country' => $request->country ?? 'India',
            'zip_code' => $request->zip_code,

            'opening_balance' => (float) ($request->opening_balance ?? 0),
            'current_balance' => (float) ($request->current_balance ?? $customer->current_balance),
            'credit_limit' => (float) ($request->credit_limit ?? 0),
            'payment_terms' => (int) ($request->credit_period ?? 0),

            'customer_type' => $request->party_type ?? $customer->customer_type,
            'notes' => $request->notes,

            'custom_fields' => json_encode([
                'birthday' => $request->custom_birthday,
                'drug_license' => $request->custom_drug_license,
                'bank_accounts' => $request->bank_accounts ?? [],
            ]),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Customer updated successfully',
            'data' => $customer->fresh(),
        ]);
    }
}
