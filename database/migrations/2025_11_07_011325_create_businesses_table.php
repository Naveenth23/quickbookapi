<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('businesses', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('country')->nullable();
            $table->string('zip_code')->nullable();
            $table->string('gstin')->nullable();
            $table->string('pan')->nullable();
            $table->string('website')->nullable();
            $table->string('logo')->nullable();
            $table->string('business_type')->nullable();
            $table->string('invoice_prefix')->default('INV');
            $table->string('quote_prefix')->default('QUO');
            $table->string('currency')->default('INR');
            $table->string('timezone')->default('Asia/Kolkata');
            $table->string('date_format')->default('d/m/Y');
            $table->string('decimal_separator')->default('.');
            $table->string('thousand_separator')->default(',');
            $table->integer('decimal_places')->default(2);
            $table->boolean('is_active')->default(true);
            $table->foreignId('owner_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('businesses');
    }
};
