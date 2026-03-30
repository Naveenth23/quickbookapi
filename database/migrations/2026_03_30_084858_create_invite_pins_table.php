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
        Schema::create('invite_pins', function (Blueprint $table) {
            $table->id();
            $table->string('pin', 10)->unique();          // plain text stored hashed
            $table->string('pin_hash');                    // bcrypt hash
            $table->string('label')->nullable();           // e.g. "Beta testers batch 1"
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('max_uses')->default(0);   // 0 = unlimited
            $table->unsignedInteger('used_count')->default(0);
            $table->timestamp('expires_at')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
 
            $table->index('is_active');
        });

        DB::table('invite_pins')->insert([
            'pin'        => 'BB2024',            // keep short for easy sharing
            'pin_hash'   => Hash::make('BB2024'),
            'label'      => 'Default launch PIN',
            'is_active'  => true,
            'max_uses'   => 0,
            'used_count' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invite_pins');
    }
};
