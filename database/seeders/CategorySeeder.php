<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Electronics',
                'slug' => Str::slug('Electronics'),
                'description' => 'Electronic gadgets and devices like phones, TVs, and computers.',
                'image' => 'categories/electronics.jpg',
                'sort_order' => 1,
                'is_active' => true,
                'business_id' => 3,
            ],
            [
                'name' => 'Home Appliances',
                'slug' => Str::slug('Home Appliances'),
                'description' => 'Appliances for home use such as washing machines, fridges, and ovens.',
                'image' => 'categories/home-appliances.jpg',
                'sort_order' => 2,
                'is_active' => true,
                'business_id' => 3,
            ],
            [
                'name' => 'Fashion',
                'slug' => Str::slug('Fashion'),
                'description' => 'Clothing, footwear, and accessories for men and women.',
                'image' => 'categories/fashion.jpg',
                'sort_order' => 3,
                'is_active' => true,
                'business_id' => 3,
            ],
            [
                'name' => 'Groceries',
                'slug' => Str::slug('Groceries'),
                'description' => 'Everyday essentials like food, beverages, and household items.',
                'image' => 'categories/groceries.jpg',
                'sort_order' => 4,
                'is_active' => true,
                'business_id' => 3,
            ],
            [
                'name' => 'Stationery',
                'slug' => Str::slug('Stationery'),
                'description' => 'Office supplies and school stationery items.',
                'image' => 'categories/stationery.jpg',
                'sort_order' => 5,
                'is_active' => true,
                'business_id' => 3,
            ],
        ];

        foreach ($categories as $data) {
            Category::updateOrCreate(
                ['slug' => $data['slug']], // Prevent duplicates
                $data
            );
        }
    }
}
