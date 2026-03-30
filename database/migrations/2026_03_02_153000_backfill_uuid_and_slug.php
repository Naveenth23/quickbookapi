<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('businesses')->get()->each(function ($business) {
            DB::table('businesses')
                ->where('id', $business->id)
                ->update([
                    'uuid' => Str::uuid(),
                    'slug' => $business->slug ?? Str::slug($business->name) . '-' . Str::random(4)
                ]);
        });

        DB::table('products')->get()->each(function ($product) {
            DB::table('products')
                ->where('id', $product->id)
                ->update([
                    'uuid' => Str::uuid(),
                    'slug' => Str::slug($product->name) . '-' . Str::random(4)
                ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
