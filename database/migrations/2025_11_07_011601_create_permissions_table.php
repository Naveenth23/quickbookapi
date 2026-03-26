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
        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('group')->nullable(); // module group: products, orders, customers, etc.
            $table->string('category')->nullable(); // action category: view, create, update, delete
            $table->boolean('is_active')->default(true);
            $table->boolean('is_system')->default(false); // system permissions cannot be deleted
            $table->json('metadata')->nullable(); // additional settings
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permissions');
    }
};
