<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\Business;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CustomerFactory extends Factory
{
    protected $model = Customer::class;

    public function definition(): array
    {
        $customerTypes = ['Customer', 'Supplier'];
        $balanceTypes = ['To Collect', 'To Pay'];
        $category = ['Retail', 'Wholesale'];

        return [
            'customer_code' => 'CUST-' . strtoupper(Str::random(6)),
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->numerify('##########'),
            'alternate_phone' => $this->faker->optional()->numerify('##########'),
            'company_name' => $this->faker->company(),
            'gstin' => strtoupper($this->faker->bothify('##????####?1Z?')),
            'pan' => strtoupper($this->faker->bothify('?????#####?')),
            'billing_address' => $this->faker->address(),
            'shipping_address' => $this->faker->address(),
            'city' => $this->faker->city(),
            'state' => $this->faker->state(),
            'country' => $this->faker->country(),
            'zip_code' => $this->faker->postcode(),
            'opening_balance' => $this->faker->randomFloat(2, 0, 5000),
            'current_balance' => $this->faker->randomFloat(2, 0, 5000),
            'credit_limit' => $this->faker->randomFloat(2, 0, 10000),
            'payment_terms' => $this->faker->numberBetween(0, 60),
            'total_purchases' => $this->faker->randomFloat(2, 0, 10000),
            'total_orders' => $this->faker->numberBetween(0, 50),
            'last_order_date' => $this->faker->optional()->dateTimeBetween('-6 months', 'now'),
            'customer_type' => $this->faker->randomElement($customerTypes),
            'category' => $this->faker->randomElement($category),
            'balance_type' => $this->faker->randomElement($balanceTypes),
            'is_active' => $this->faker->boolean(90),
            'notes' => $this->faker->sentence(6),
            'custom_fields' => json_encode([
                'ref_code' => strtoupper(Str::random(8)),
                'loyalty_points' => $this->faker->numberBetween(0, 200),
            ]),
            // assign a random existing business (make sure at least 1 exists)
            'business_id' => 3,
        ];
    }
}
