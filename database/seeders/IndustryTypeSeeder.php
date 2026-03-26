<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class IndustryTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $industries = [
            ['name' => 'Agriculture', 'description' => 'Farming, crop production, and related agricultural services'],
            ['name' => 'Automotive', 'description' => 'Manufacture, sale, or repair of vehicles and auto parts'],
            ['name' => 'Banking & Finance', 'description' => 'Financial institutions, loans, insurance, and investment services'],
            ['name' => 'Construction', 'description' => 'Residential, commercial, and infrastructure construction projects'],
            ['name' => 'Consulting', 'description' => 'Professional business and management consulting services'],
            ['name' => 'Consumer Goods', 'description' => 'Production and sale of household or personal products'],
            ['name' => 'Education', 'description' => 'Schools, colleges, training institutes, and e-learning platforms'],
            ['name' => 'Energy & Utilities', 'description' => 'Power generation, renewable energy, and public utilities'],
            ['name' => 'Engineering', 'description' => 'Civil, mechanical, and industrial engineering services'],
            ['name' => 'Entertainment & Media', 'description' => 'Film, TV, music, publishing, and online media'],
            ['name' => 'Event Management', 'description' => 'Event planning, coordination, and promotion services'],
            ['name' => 'E-commerce', 'description' => 'Online retail and digital marketplace businesses'],
            ['name' => 'Fashion & Apparel', 'description' => 'Clothing, footwear, and accessories manufacturing and sales'],
            ['name' => 'FMCG (Fast Moving Consumer Goods)', 'description' => 'Quick-selling consumer products like food, beverages, toiletries'],
            ['name' => 'Food & Beverages', 'description' => 'Restaurants, catering, packaged foods, and drinks'],
            ['name' => 'Healthcare', 'description' => 'Hospitals, clinics, diagnostics, and health products'],
            ['name' => 'Hospitality', 'description' => 'Hotels, resorts, and travel accommodation services'],
            ['name' => 'Information Technology', 'description' => 'Software development, IT services, and SaaS platforms'],
            ['name' => 'Internet Services', 'description' => 'Web hosting, digital marketing, and online platforms'],
            ['name' => 'Legal Services', 'description' => 'Law firms, legal consultants, and arbitration services'],
            ['name' => 'Logistics & Transportation', 'description' => 'Courier, freight, supply chain, and warehousing'],
            ['name' => 'Manufacturing', 'description' => 'Production and assembly of industrial or consumer products'],
            ['name' => 'Mining & Metals', 'description' => 'Extraction and processing of minerals and metals'],
            ['name' => 'Non-Profit & NGOs', 'description' => 'Charitable and social welfare organizations'],
            ['name' => 'Oil & Gas', 'description' => 'Exploration, refining, and distribution of petroleum and gas products'],
            ['name' => 'Pharmaceuticals', 'description' => 'Drug research, development, and manufacturing companies'],
            ['name' => 'Printing & Publishing', 'description' => 'Printing press, newspapers, and publishing houses'],
            ['name' => 'Real Estate', 'description' => 'Property development, brokerage, and management'],
            ['name' => 'Retail', 'description' => 'Supermarkets, convenience stores, and retail chains'],
            ['name' => 'Security Services', 'description' => 'Private security, surveillance, and risk management'],
            ['name' => 'Telecommunications', 'description' => 'Internet, mobile, and broadband service providers'],
            ['name' => 'Textiles', 'description' => 'Fabric, garments, and textile product manufacturing'],
            ['name' => 'Tourism & Travel', 'description' => 'Tour operators, travel agencies, and transport services'],
            ['name' => 'Trading', 'description' => 'Wholesale, import-export, and commodity trading businesses'],
            ['name' => 'Agritech', 'description' => 'Technology-driven agriculture and farming innovations'],
            ['name' => 'Fintech', 'description' => 'Financial technology products and digital payment systems'],
            ['name' => 'Edtech', 'description' => 'Online education and digital learning solutions'],
            ['name' => 'Healthtech', 'description' => 'Healthcare software and device innovation companies'],
            ['name' => 'Insurtech', 'description' => 'Insurance technology and digital risk management platforms'],
            ['name' => 'Real Estate Tech (Proptech)', 'description' => 'Technology solutions for real estate and property management'],
            ['name' => 'Biotechnology', 'description' => 'Biotech research and product development'],
            ['name' => 'Aerospace & Defense', 'description' => 'Aircraft manufacturing, defense contracts, and space research'],
            ['name' => 'Chemicals', 'description' => 'Chemical manufacturing, paints, and allied industries'],
            ['name' => 'Electronics', 'description' => 'Consumer and industrial electronic products'],
            ['name' => 'Hardware & Networking', 'description' => 'Computer hardware, peripherals, and network services'],
            ['name' => 'Marine', 'description' => 'Shipping, ports, and marine services'],
            ['name' => 'Media & Advertising', 'description' => 'Marketing, PR, and digital advertising agencies'],
            ['name' => 'Sports & Fitness', 'description' => 'Gyms, sports clubs, and fitness products'],
            ['name' => 'Waste Management', 'description' => 'Recycling and waste disposal services'],
            ['name' => 'Other', 'description' => 'Industries not categorized above'],
        ];

        DB::table('industry_types')->insert($industries);
    }
}
