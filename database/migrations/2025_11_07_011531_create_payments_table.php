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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->string('payment_number')->unique();
            $table->enum('payment_type', ['sale', 'purchase', 'expense', 'income', 'refund']);
            $table->enum('payment_method', ['cash', 'card', 'upi', 'bank_transfer', 'cheque', 'wallet', 'other']);
            $table->decimal('amount', 10, 2);
            $table->date('payment_date');
            $table->string('reference_number')->nullable(); // transaction id, cheque number
            $table->string('bank_name')->nullable();
            $table->string('account_number')->nullable();
            $table->string('ifsc_code')->nullable();
            $table->string('card_last_four')->nullable();
            $table->string('upi_id')->nullable();
            $table->string('wallet_provider')->nullable();
            $table->string('attachment')->nullable(); // payment proof
            $table->text('notes')->nullable();
            $table->boolean('is_refund')->default(false);
            $table->decimal('refund_amount', 10, 2)->default(0);
            $table->date('refund_date')->nullable();
            $table->string('refund_reason')->nullable();
            $table->boolean('is_cancelled')->default(false);
            $table->date('cancelled_date')->nullable();
            $table->text('cancellation_reason')->nullable();
            $table->json('custom_fields')->nullable();
            $table->foreignId('business_id')->constrained()->onDelete('cascade');
            $table->foreignId('order_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('purchase_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('expense_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('customer_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('supplier_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('received_by')->nullable()->constrained('users')->onDelete('restrict');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
