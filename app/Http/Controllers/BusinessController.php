<?php

namespace App\Http\Controllers;

use App\Models\IndustryType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BusinessController extends Controller
{

    public function index(Request $request)
    {
        try {
            $user = $request->user();

            // Find the active business for this user
            $business = $user->businesses()
                ->wherePivot('is_active', true)
                ->first();

            if (!$business) {
                return response()->json([
                    'success' => false,
                    'message' => 'No active business found.',
                ], 404);
            }

            $business->logo_url = $business->logo
                ? asset('storage/' . $business->logo)
                : null;

            $business->signature_url = $business->signature
                ? asset('storage/' . $business->signature)
                : null;

            return response()->json([
                'success' => true,
                'data' => $business,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load business: ' . $e->getMessage(),
            ], 500);
        }
    }


    public function update(Request $request)
    {
        try {
            $user = auth()->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Please login again.',
                ], 401);
            }

            // ✅ Get active business for this user
            $userBusiness = $user->businesses()
                ->wherePivot('is_active', true)
                ->first();

            if (!$userBusiness) {
                return response()->json([
                    'success' => false,
                    'message' => 'No active business found for this user.',
                ], 404);
            }

            // ✅ Validation rules
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'nullable|email|max:255|unique:businesses,email,' . $userBusiness->id,
                'phone' => 'nullable|string|max:20',
                'address' => 'nullable|string',
                'city' => 'nullable|string|max:255',
                'state' => 'nullable|string|max:255',
                'country' => 'nullable|string|max:255',
                'zip_code' => 'nullable|string|max:10',
                'gstin' => 'nullable|string|max:20',
                'pan' => 'nullable|string|max:20',
                'website' => 'nullable|string|max:255',
                'business_type' => 'nullable|string|max:255',
                'industry_type' => 'nullable|string|max:255',
                'is_gst_registered' => 'nullable|boolean',
                'enable_e_invoice' => 'nullable|boolean',
                'logo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
                'signature' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            ]);

            // ✅ Convert checkboxes to booleans
            $validated['is_gst_registered'] = $request->boolean('is_gst_registered');
            $validated['enable_e_invoice'] = $request->boolean('enable_e_invoice');

            // ✅ Handle logo upload
            if ($request->hasFile('logo')) {
                if ($userBusiness->logo && Storage::disk('public')->exists($userBusiness->logo)) {
                    Storage::disk('public')->delete($userBusiness->logo);
                }
                $validated['logo'] = $request->file('logo')->store('uploads/logos', 'public');
            }

            // ✅ Handle signature upload
            if ($request->hasFile('signature')) {
                if ($userBusiness->signature && Storage::disk('public')->exists($userBusiness->signature)) {
                    Storage::disk('public')->delete($userBusiness->signature);
                }
                $validated['signature'] = $request->file('signature')->store('uploads/signatures', 'public');
            }

            // ✅ Update business record
            $userBusiness->update($validated);

            // ✅ Return updated data with file URLs
            $userBusiness->refresh();
            $userBusiness->logo_url = $userBusiness->logo ? asset('storage/' . $userBusiness->logo) : null;
            $userBusiness->signature_url = $userBusiness->signature ? asset('storage/' . $userBusiness->signature) : null;

            return response()->json([
                'success' => true,
                'message' => 'Business updated successfully.',
                'data' => $userBusiness,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update business: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function updateBranding(Request $request)
    {
        $request->validate([
            'stamp' => 'nullable|image|mimes:png,jpg,jpeg|max:2048',
            'signature' => 'nullable|image|mimes:png,jpg,jpeg|max:2048',
            'upi_id' => 'nullable|string'
        ]);

        $business = $request->user()->business;

        if ($request->hasFile('stamp')) {
            $business->stamp = $request->file('stamp')
                ->store('business/stamp', 'public');
        }

        if ($request->hasFile('signature')) {
            $business->signature = $request->file('signature')
                ->store('business/signature', 'public');
        }

        if ($request->upi_id) {
            $business->upi_id = $request->upi_id;
        }

        $business->save();

        return response()->json([
            'message' => 'Branding updated successfully ✅',
            'business' => $business
        ]);
    }

    //Industry Type
    public function getIndustryTypes()
    {
        $types = IndustryType::select('id', 'name')->orderBy('name')->get();

        return response()->json([
            'success' => true,
            'data' => $types
        ]);
    }
}
