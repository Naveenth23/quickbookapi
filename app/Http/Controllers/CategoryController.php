<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $business = $request->user()
            ->businesses()
            ->wherePivot('is_active', true)
            ->firstOrFail();

        $categories = $business->categories()
            ->select('categories.id', 'categories.name')
            ->orderBy('categories.name')
            ->get()
            ->makeHidden('pivot');

        return response()->json([
            'business' => $business->name,
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
        ]);

        $business = $request->user()
            ->businesses()
            ->wherePivot('is_active', true)
            ->firstOrFail();

        $category = Category::firstOrCreate(
            ['name' => $request->name],
            ['slug' => \Str::slug($request->name)]
        );

        $business->categories()->syncWithoutDetaching($category->id);

        return response()->json($category);
    }
}
