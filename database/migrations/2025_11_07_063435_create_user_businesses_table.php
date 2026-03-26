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
        Schema::create('user_businesses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('business_id')->constrained()->onDelete('cascade');

            // role and access control
            $table->unsignedBigInteger('role_id')->nullable()->comment('links to roles table');
            $table->boolean('is_active')->default(true);

            // system-assigned or user-assigned
            $table->unsignedBigInteger('assigned_by_id')->default(0);
            $table->string('assigned_by_type')->default('system');

            // optional joined timestamp
            $table->timestamp('joined_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_businesses');
    }
};
