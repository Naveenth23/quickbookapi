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
        Schema::create('auth_pins', function (Blueprint $table) {
            $table->id();
            $table->string('identifier');           // phone number or email
            $table->enum('type', ['mobile', 'email']); // channel used
            $table->string('pin', 10);              // hashed 4–6-digit OTP
            $table->string('purpose')->default('login'); // login | register | reset
            $table->boolean('is_used')->default(false);
            $table->timestamp('expires_at');
            $table->unsignedInteger('attempts')->default(0);
            $table->string('ip_address', 45)->nullable();
            $table->timestamps();
 
            $table->index(['identifier', 'type', 'purpose']);
            $table->index('expires_at');
        });


        Schema::create('user_social_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('provider');             // facebook | google | apple
            $table->string('provider_id');          // ID from the provider
            $table->text('access_token')->nullable();
            $table->text('refresh_token')->nullable();
            $table->timestamp('token_expires_at')->nullable();
            $table->json('raw_data')->nullable();   // store full provider payload
            $table->timestamps();
 
            $table->unique(['provider', 'provider_id']);
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_social_accounts');
        Schema::dropIfExists('auth_pins');
    }
};
