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
        Schema::table('businesses', function (Blueprint $table) {
            $table->string('signature')->nullable()->after('logo');
            $table->string('industry_type')->nullable()->after('business_type');
            $table->boolean('is_gst_registered')->default(false)->after('gstin');
            $table->boolean('enable_e_invoice')->default(false)->after('is_gst_registered');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('businesses', function (Blueprint $table) {
            $table->dropColumn(['is_gst_registered', 'enable_e_invoice','signature','industry_type']);
        });
    }
};
