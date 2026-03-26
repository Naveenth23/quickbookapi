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
        Schema::create('purchases', function (Blueprint $table) {
            $table->id();
            $table->string('purchase_number')->unique();
            $table->string('bill_number')->nullable();
            $table->date('purchase_date');
            $table->date('due_date')->nullable();
            $table->enum('status', ['draft', 'pending', 'received', 'partially_received', 'cancelled', 'returned']);
            $table->enum('payment_status', ['pending', 'partial', 'paid', 'overdue']);
            $table->decimal('subtotal', 10, 2)->default(0);
            $table->decimal('tax_amount', 10, 2)->default(0);
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->decimal('shipping_amount', 10, 2)->default(0);
            $table->decimal('total_amount', 10, 2)->default(0);
            $table->decimal('paid_amount', 10, 2)->default(0);
            $table->decimal('balance_amount', 10, 2)->default(0);
            $table->decimal('taxable_amount', 10, 2)->default(0);
            $table->decimal('cgst_amount', 10, 2)->default(0);
            $table->decimal('sgst_amount', 10, 2)->default(0);
            $table->decimal('igst_amount', 10, 2)->default(0);
            $table->decimal('cess_amount', 10, 2)->default(0);
            $table->string('notes')->nullable();
            $table->string('terms_and_conditions')->nullable();
            $table->date('received_date')->nullable();
            $table->date('paid_date')->nullable();
            $table->boolean('is_return')->default(false);
            $table->string('return_reason')->nullable();
            $table->boolean('is_draft')->default(false);
            $table->boolean('is_cancelled')->default(false);
            $table->date('cancelled_date')->nullable();
            $table->text('cancellation_reason')->nullable();
            $table->json('custom_fields')->nullable();
            $table->foreignId('business_id')->constrained()->onDelete('cascade');
            $table->foreignId('supplier_id')->constrained()->onDelete('restrict');
            $table->foreignId('created_by')->constrained('users')->onDelete('restrict');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchases');
    }
};
