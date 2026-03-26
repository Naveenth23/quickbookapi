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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->string('invoice_number')->unique()->nullable();
            $table->string('reference_number')->nullable();
            $table->date('order_date');
            $table->date('due_date')->nullable();
            $table->enum('order_type', ['sale', 'purchase', 'estimate', 'quotation']);
            $table->enum('status', ['draft', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned', 'refunded']);
            $table->enum('payment_status', ['pending', 'partial', 'paid', 'overdue', 'refunded']);
            $table->enum('payment_method', ['cash', 'card', 'upi', 'bank_transfer', 'cheque', 'credit']);
            $table->decimal('subtotal', 10, 2)->default(0);
            $table->decimal('tax_amount', 10, 2)->default(0);
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->decimal('shipping_amount', 10, 2)->default(0);
            $table->decimal('round_off', 10, 2)->default(0);
            $table->decimal('total_amount', 10, 2)->default(0);
            $table->decimal('paid_amount', 10, 2)->default(0);
            $table->decimal('balance_amount', 10, 2)->default(0);
            $table->decimal('exchange_rate', 10, 4)->default(1);
            $table->string('currency')->default('INR');
            $table->decimal('taxable_amount', 10, 2)->default(0);
            $table->decimal('cgst_amount', 10, 2)->default(0);
            $table->decimal('sgst_amount', 10, 2)->default(0);
            $table->decimal('igst_amount', 10, 2)->default(0);
            $table->decimal('cess_amount', 10, 2)->default(0);
            $table->string('notes')->nullable();
            $table->string('terms_and_conditions')->nullable();
            $table->string('shipping_address')->nullable();
            $table->string('billing_address')->nullable();
            $table->date('shipped_date')->nullable();
            $table->date('delivered_date')->nullable();
            $table->date('paid_date')->nullable();
            $table->string('tracking_number')->nullable();
            $table->string('ewaybill_number')->nullable();
            $table->boolean('is_recurring')->default(false);
            $table->string('recurring_frequency')->nullable();
            $table->date('recurring_until')->nullable();
            $table->boolean('is_draft')->default(false);
            $table->boolean('is_cancelled')->default(false);
            $table->date('cancelled_date')->nullable();
            $table->text('cancellation_reason')->nullable();
            $table->json('custom_fields')->nullable();
            $table->foreignId('business_id')->constrained()->onDelete('cascade');
            $table->foreignId('customer_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('supplier_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('created_by')->constrained('users')->onDelete('restrict');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
