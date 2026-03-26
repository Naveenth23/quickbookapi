<?php

namespace App\Http\Controllers;

use App\Models\Unit;
use Illuminate\Http\Request;

class UnitController extends Controller
{
    public function index()
    {
        $units = Unit::select('id', 'name')->orderBy('name')->get();

        return response()->json([
            'success' => true,
            'units' => $units
        ]);
    }
}
