<?php

namespace Database\Seeders;

use App\Models\Business;
use App\Models\Unit;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure at least one business exists
        $business = Business::first() ?? Business::factory()->create([
            'name' => 'Demo Business',
            'email' => 'demo@mybillbook.com',
            'owner_id' => 1,
        ]);

        $units = [
            [
                'name' => 'Piece',
                'symbol' => 'pc',
                'description' => 'Single item or piece count',
                'is_active' => true,
                'business_id' => 3,
            ],
            [
                'name' => 'Kilogram',
                'symbol' => 'kg',
                'description' => 'Used for weight-based products',
                'is_active' => true,
                'business_id' => 3,
            ],
            [
                'name' => 'Gram',
                'symbol' => 'g',
                'description' => 'Used for smaller weight units',
                'is_active' => true,
                'business_id' => 3,
            ],
            [
                'name' => 'Liter',
                'symbol' => 'L',
                'description' => 'Used for liquid products',
                'is_active' => true,
                'business_id' => 3,
            ],
            [
                'name' => 'Milliliter',
                'symbol' => 'ml',
                'description' => 'Used for small volume liquids',
                'is_active' => true,
                'business_id' => 3,
            ],
            [
                'name' => 'Box',
                'symbol' => 'box',
                'description' => 'Used for products sold in boxes or cartons',
                'is_active' => true,
                'business_id' => 3,
            ],
            [
                'name' => 'Packet',
                'symbol' => 'pkt',
                'description' => 'Used for packaged goods',
                'is_active' => true,
                'business_id' => 3,
            ],
            [
                'name' => 'Meter',
                'symbol' => 'm',
                'description' => 'Used for length or distance measurements',
                'is_active' => true,
                'business_id' => 3,
            ],
            [
                'name' => 'Dozen',
                'symbol' => 'dz',
                'description' => 'Set of twelve items',
                'is_active' => true,
                'business_id' => 3,
            ],
            [
                'name' => 'Pair',
                'symbol' => 'pr',
                'description' => 'Used for items sold in pairs (e.g., shoes, gloves)',
                'is_active' => true,
                'business_id' => 3,
            ],
        ];

        foreach ($units as $unit) {
            Unit::updateOrCreate(
                ['name' => $unit['name'], 'business_id' => 3],
                $unit
            );
        }
    }
}
