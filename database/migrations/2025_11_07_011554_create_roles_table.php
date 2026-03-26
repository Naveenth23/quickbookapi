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
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('color')->nullable(); // for UI display
            $table->boolean('is_active')->default(true);
            $table->boolean('is_system')->default(false); // system roles cannot be deleted
            $table->integer('level')->default(1); // role hierarchy level
            $table->json('permissions')->nullable(); // cached permissions
            $table->json('metadata')->nullable(); // additional settings
            $table->foreignId('business_id')->nullable()->constrained()->onDelete('cascade'); // null for global roles
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('roles');
    }
};
