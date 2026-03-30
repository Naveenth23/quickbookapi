<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use Faker\Factory as Faker;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        // Define some random categories, brands, and units (optional)
        $categoryIds = range(1, 5); // assumes you have at least 5 categories
        $brandIds = range(1, 5); // assumes you have at least 5 brands
        $unitIds = range(1, 5); // assumes you have at least 5 units
        $businessId = 1; // assuming one active business for now

        for ($i = 1; $i <= 100; $i++) {
            $name = ucfirst($faker->words(2, true)); // e.g., "Smart Watch"
            $sku = strtoupper($faker->bothify('SKU-#####'));
            $barcode = strtoupper($faker->bothify('BAR-##########'));
            $purchasePrice = $faker->randomFloat(2, 50, 5000);
            $salePrice = $purchasePrice + $faker->randomFloat(2, 10, 1000);
            $wholesalePrice = $salePrice - $faker->randomFloat(2, 10, 200);
            $mrp = $salePrice + $faker->randomFloat(2, 10, 500);
            $stock = $faker->numberBetween(0, 500);
            $taxRate = $faker->randomElement([0, 5, 12, 18, 28]);
            $taxType = $faker->randomElement(['gst', 'igst', 'none']);

            Product::create([
                'name' => $name,
                'sku' => $sku,
                'barcode' => $barcode,
                'hsn_code' => $faker->numerify('######'),
                'description' => $faker->sentence(10),
                'purchase_price' => $purchasePrice,
                'sale_price' => $salePrice,
                'wholesale_price' => $wholesalePrice,
                'mrp' => $mrp,
                'stock_quantity' => $stock,
                'min_stock_level' => $faker->numberBetween(2, 10),
                'max_stock_level' => $faker->numberBetween(50, 500),
                'tax_rate' => $taxRate,
                'tax_type' => $taxType,
                'discount_percent' => $faker->randomFloat(2, 0, 15),
                'discount_type' => 'percentage',
                'track_inventory' => true,
                'is_active' => true,
                'is_featured' => $faker->boolean(10),
                'image' => null,
                'gallery' => json_encode([]),
                'attributes' => json_encode([
                    'size' => $faker->randomElement(['S', 'M', 'L', 'XL']),
                    'color' => $faker->safeColorName(),
                ]),
                'weight' => $faker->randomFloat(2, 0.1, 5) . ' kg',
                'dimensions' => $faker->randomElement([
                    '10x10x5 cm',
                    '20x15x10 cm',
                    '30x20x15 cm',
                ]),
                'business_id' => 3,
                'category_id' => 7,
                'unit_id' => $faker->randomElement($unitIds),
            ]);
        }
    }
}
