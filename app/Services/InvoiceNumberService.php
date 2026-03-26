<?php

namespace App\Services;

use App\Models\Invoice;
use Carbon\Carbon;

class InvoiceNumberService
{
    public static function generate($businessId)
    {
        // Get Financial Year (India standard)
        $now = Carbon::now();
        $year = (int)$now->format('Y');
        $fyStartYear = $now->month >= 4 ? $year : $year - 1;
        $nextFYYear = $fyStartYear + 1;

        $fy = $fyStartYear . '-' . substr($nextFYYear, -2);

        $prefix = "INV-$fy/";

        // Find last invoice of same FY & business
        $last = Invoice::where('business_id', $businessId)
            ->where('invoice_number', 'like', "$prefix%")
            ->orderByDesc('id')
            ->first();

        if (!$last) {
            return $prefix . "00001";
        }

        // Extract last number part
        $number = (int)substr($last->invoice_number, -5);
        $next = str_pad($number + 1, 5, '0', STR_PAD_LEFT);

        return $prefix . $next;
    }
}
