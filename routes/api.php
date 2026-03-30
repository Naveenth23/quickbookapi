<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\BusinessController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\PartyController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\StaffInviteController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\CustomerTransactionController;
use App\Http\Controllers\StockAdjustmentController;
use App\Http\Controllers\StockSummaryController;
use App\Http\Controllers\SyncController;

use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::post('/auth/send-otp',        [AuthController::class, 'sendOtp']);
Route::post('/auth/verify-otp',      [AuthController::class, 'verifyOtp']);
Route::post('/auth/google',          [AuthController::class, 'googleAuth']);
Route::post('/auth/login-mobile-pin',   [AuthController::class, 'loginMobilePin']);
Route::post('/auth/login-email-pin',    [AuthController::class, 'loginEmailPin']);
Route::post('/auth/register-mobile-pin',[AuthController::class, 'registerMobilePin']);
Route::post('/auth/register-email-pin', [AuthController::class, 'registerEmailPin']);
Route::post('/auth/facebook',           [AuthController::class, 'facebookAuth']);

Route::post('/auth/create-business', [AuthController::class, 'createBusiness'])
     ->middleware('auth:sanctum');

use App\Http\Controllers\ReportController;
use App\Http\Controllers\UnitController;
Route::get('/sync/pull',  [SyncController::class, 'pull']);
Route::post('/sync/push', [SyncController::class, 'push']);

Route::middleware(['tenant', 'auth:sanctum'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/states', [DashboardController::class, 'states']);
    Route::get('/reports/sales', [ReportController::class, 'sales']);
    Route::get('/reports/purchases', [ReportController::class, 'purchases']);
    Route::get('/reports/stock', [ReportController::class, 'stock']);
    Route::get('/reports/customers', [ReportController::class, 'customers']);
    Route::get('/reports/suppliers', [ReportController::class, 'suppliers']);
    Route::get('/reports/gstr1', [ReportController::class, 'gstr1']);
    Route::get('/reports/gstr3b', [ReportController::class, 'gstr3b']);

    Route::post('logout', [LoginController::class, 'logout']);

    // Categories
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/categories', [CategoryController::class, 'store']);

    // Units
    Route::get('/units', [UnitController::class, 'index']);

    // Products
    Route::get('/products', [ProductController::class, 'index']);
    Route::post('/products/{uuid}/image', [ProductController::class, 'storeImage']);
    Route::post('/products/bulk-delete', [ProductController::class, 'bulkDelete']);

    Route::post('/products/{uuid}/adjust-stock', [StockAdjustmentController::class, 'store']);
    Route::get('/products/{uuid}/stock-history',  [StockAdjustmentController::class, 'history']);
    // Route::get('/products/{id}', [ProductController::class, 'show']);
    // Route::put('/products/{id}', [ProductController::class, 'update'])->middleware('role:owner,staff');
    // Route::delete('/products/{id}', [ProductController::class, 'destroy'])->middleware('role:owner');

    // Parties (Customer & Vendor)

    // Customer
    Route::get('/gstinfo/{gstin}', [CustomerController::class, 'fetchGST']);
    Route::get('/customers', [CustomerController::class, 'index']);
    Route::post('/customers', [CustomerController::class, 'store']);
    Route::put('/customers/{id}', [CustomerController::class, 'update']);
    Route::get('/customers/{id}', [CustomerController::class, 'show']);
    
    Route::get('/parties', [PartyController::class, 'index']);
    Route::post('/parties', [PartyController::class, 'store'])->middleware('role:owner,staff');
    Route::get('/parties/{id}', [PartyController::class, 'show']);
    Route::put('/parties/{id}', [PartyController::class, 'update'])->middleware('role:owner,staff');

    // Role Protected Routes
    Route::middleware('role:admin')->get('/admin-area', function () {
        return "Only Admin";
    });

    Route::middleware(['tenant', 'auth:sanctum','role:owner'])->group(function () {
        

        // Staff
        Route::get('/staff', [StaffController::class, 'index']);
        Route::post('/staff/invite', [StaffInviteController::class, 'invite']);
        Route::put('/staff/{id}', [StaffController::class, 'update']);
        Route::delete('/staff/{id}', [StaffController::class, 'destroy']);

        // Route::put('/business', [BusinessController::class, 'update']);

        Route::get('/business', [BusinessController::class, 'index']);
        Route::put('/business', [BusinessController::class, 'update']);
        Route::get('/industry-types', [BusinessController::class, 'getIndustryTypes']);
        Route::post('/business/update-branding', [BusinessController::class, 'updateBranding']);
        
        Route::post('/products', [ProductController::class, 'store']);
        Route::get('/inventory', [ProductController::class, 'inventoryList']);

        Route::get('/products/{product:uuid}', [ProductController::class, 'show']);
        Route::put('/products/{product:uuid}', [ProductController::class, 'update']);
        Route::delete('/products/{product:uuid}', [ProductController::class, 'destroy']);

        Route::get('/reports/stock-summary',         [StockSummaryController::class, 'index']);
        Route::get('/reports/stock-summary/export',  [StockSummaryController::class, 'export']);

        Route::post('/orders', [OrderController::class, 'store']);
        Route::get('/orders', [OrderController::class, 'index']);
        Route::get('/orders/{order}', [OrderController::class, 'show']);
        Route::put('/orders/{order}',   [OrderController::class, 'update']);
        Route::get('/google-sheet/import', [ProductController::class, 'importFromGoogleSheet']);


        // Payment List & detail
        Route::get('/payments',          [PaymentController::class, 'index']);
        Route::get('/payments/summary',  [PaymentController::class, 'summary']);   // before {id} to avoid collision
        Route::get('/payments/{id}',     [PaymentController::class, 'show']);
    
        // Record money IN (customer pays us)
        Route::post('/payments/in',      [PaymentController::class, 'recordIn']);
    
        // Record money OUT (we pay supplier)
        Route::post('/payments/out',     [PaymentController::class, 'recordOut']);
    
        // Edit a payment (amount, method, notes …)
        Route::put('/payments/{id}',     [PaymentController::class, 'update']);
    
        // Cancel a payment (reverses balance)
        Route::post('/payments/{id}/cancel',    [PaymentController::class, 'cancel']);
    
        // Refund a payment (partial or full)
        Route::post('/payments/{id}/refund',    [PaymentController::class, 'refund']);
    
        // Remove an attached proof file
        Route::delete('/payments/{id}/attachment', [PaymentController::class, 'deleteAttachment']);


        Route::get('/customers/{customer}/transactions',
        [CustomerTransactionController::class, 'index']);
 
        Route::get('/customers/{customer}/transactions/{txnId}',
            [CustomerTransactionController::class, 'show']);
    });

    Route::middleware('role:owner,staff')->group(function () {
        Route::get('invoices', [InvoiceController::class, 'index']);
        Route::post('invoices', [InvoiceController::class, 'store']);
        Route::get('invoices/{invoice}', [InvoiceController::class, 'show']);
        Route::put('invoices/{invoice}', [InvoiceController::class, 'update']);
        Route::delete('invoices/{invoice}', [InvoiceController::class, 'destroy']);

        Route::get('/invoices/{id}/print', [InvoiceController::class, 'printPdf'])
            ->name('invoices.print');

        Route::get('/invoices/{id}', [InvoiceController::class, 'show']);
        Route::get('/invoices/{id}/download', [InvoiceController::class, 'download']);

        Route::post('/invoices/{id}/payments', [InvoiceController::class, 'addPayment'])
            ->middleware('auth:sanctum');
    });
});




Route::post('/accept-invite/{token}', [StaffInviteController::class, 'accept']);
