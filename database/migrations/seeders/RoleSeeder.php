<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Role::insert([
            [
                'name' => 'Owner',
                'slug' => 'owner',
                'description' => 'Business owner with full permissions',
                'level' => 1,
                'is_system' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Staff',
                'slug' => 'staff',
                'description' => 'Can manage products, customers, and invoices',
                'level' => 2,
                'is_system' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Admin',
                'slug' => 'admin',
                'description' => 'System admin for all businesses',
                'level' => 0,
                'is_system' => true,
                'is_active' => true,
            ],
        ]);
    }
}
