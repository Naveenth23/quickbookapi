<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        $this->call([
            // CategorySeeder::class,
            // ProductSeeder::class,
            // UnitSeeder::class,
            // CustomerSeeder::class
            // IndustryTypeSeeder::class
            StatesTableSeeder::class
        ]);
        

        $ownerRole = Role::where('slug', 'owner')->first();

        if ($ownerRole) {
            // Attach the owner role to the user
            $user = User::where('email', 'owner@test.com')->first();
            $user->roles()->syncWithoutDetaching([$ownerRole->id]);
            $this->command->info("✅ Assigned 'owner' role to user: {$user->email}");
        } else {
            $this->command->warn("⚠️ Owner role not found. Run RoleSeeder first.");
        }
    }
}
