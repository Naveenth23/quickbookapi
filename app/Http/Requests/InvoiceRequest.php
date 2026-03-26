<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Auth;

class InvoiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check();
    }

    public function rules(): array
    {
        $businessId = Auth::user()->business_id;

        return [
            'customer_id' => 'required|exists:parties,id,business_id,' . $businessId,
            'invoice_date' => 'required|date',
            'discount' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string|max:1000',

            'items' => 'required|array|min:1',

            // Product must belong to authenticated user's business
            'items.*.product_id' =>
                'required|exists:products,id,business_id,' . $businessId,

            'items.*.qty' => 'required|numeric|min:1',
            'items.*.price' => 'required|numeric|min:0',
        ];
    }

    protected function prepareForValidation()
    {
        // Convert empty string to null for numeric fields
        $this->merge([
            'discount' => $this->discount ?: 0,
        ]);
    }

    public function messages(): array
    {
        return [
            'customer_id.exists' => 'Customer does not belong to your business.',
            'items.*.product_id.exists' => 'One or more products are invalid.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'message' => 'Validation Failed',
                'errors' => $validator->errors()
            ], 422)
        );
    }
}
