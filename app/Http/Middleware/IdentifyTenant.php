<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Business;

class IdentifyTenant
{
    public function handle(Request $request, Closure $next)
    {
        $host = $request->getHost();

        // Extract subdomain
        $parts = explode('.', $host);

        if (count($parts) < 2) {
            abort(404, 'Invalid tenant.');
        }

        $subdomain = $parts[0];

        $business = Business::where('slug', $subdomain)
            ->where('is_active', true)
            ->first();

        if (!$business) {
            abort(404, 'Business not found.');
        }

        app()->instance('currentBusiness', $business);

        return $next($request);
    }
}