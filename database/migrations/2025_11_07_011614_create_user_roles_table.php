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
        Schema::create('user_roles', function (Blueprint $table) {
            $table->id();
            $table->boolean('is_active')->default(true);
            $table->date('expires_at')->nullable(); // role expiration date
            $table->json('conditions')->nullable(); // conditional role assignment
            $table->json('restrictions')->nullable(); // role-specific restrictions
            $table->string('assigned_by_type')->nullable(); // polymorphic: admin, system, etc.
            $table->bigInteger('assigned_by_id')->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('role_id')->constrained()->onDelete('cascade');
            $table->foreignId('business_id')->nullable()->constrained()->onDelete('cascade'); // null for global roles
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_roles');
    }
};
