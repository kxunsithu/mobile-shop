<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AdminProductController;
use App\Http\Controllers\AdminCategoryController;
use App\Http\Controllers\AdminBrandController;
use App\Http\Controllers\AdminOrderController;
use App\Http\Controllers\AdminCustomerController;
use App\Http\Controllers\AdminInventoryController;

Route::prefix('v1')->group(function () {
    // Auth
    Route::post('auth/register', [AuthController::class, 'register']);
    Route::post('auth/login', [AuthController::class, 'login']);

    // Public catalog
    Route::get('categories', [CategoryController::class, 'index']);
    Route::get('categories/{category}', [CategoryController::class, 'show']);
    Route::get('brands', [BrandController::class, 'index']);
    Route::get('brands/{brand}', [BrandController::class, 'show']);
    Route::get('products', [ProductController::class, 'index']);
    Route::get('products/{product}', [ProductController::class, 'show']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::get('auth/me', [AuthController::class, 'me']);
        Route::put('auth/profile', [AuthController::class, 'updateProfile']);
        Route::put('auth/password', [AuthController::class, 'changePassword']);

        // Addresses
        Route::apiResource('addresses', AddressController::class);

        // Cart
        Route::get('cart', [CartController::class, 'show']);
        Route::post('cart/items', [CartController::class, 'addItem']);
        Route::put('cart/items/{item}', [CartController::class, 'updateItem']);
        Route::delete('cart/items/{item}', [CartController::class, 'removeItem']);
        Route::delete('cart', [CartController::class, 'clear']);

        // Orders
        Route::get('orders', [OrderController::class, 'index']);
        Route::post('orders', [OrderController::class, 'store']);
        Route::get('orders/{order}', [OrderController::class, 'show']);
        Route::post('orders/{order}/cancel', [OrderController::class, 'cancel']);

        // Customer
        Route::get('customer/profile', [CustomerController::class, 'profile']);

        // Admin routes
        Route::middleware('role:admin')->prefix('admin')->group(function () {
            Route::get('dashboard', [AdminDashboardController::class, 'index']);

            Route::apiResource('categories', AdminCategoryController::class);
            Route::apiResource('brands', AdminBrandController::class);
            Route::apiResource('products', AdminProductController::class);

            Route::get('orders', [AdminOrderController::class, 'index']);
            Route::get('orders/{order}', [AdminOrderController::class, 'show']);
            Route::put('orders/{order}', [AdminOrderController::class, 'update']);
            Route::post('orders/{order}/cancel', [AdminOrderController::class, 'cancel']);

            Route::get('customers', [AdminCustomerController::class, 'index']);
            Route::get('customers/{user}', [AdminCustomerController::class, 'show']);
            Route::put('customers/{user}', [AdminCustomerController::class, 'update']);

            Route::get('inventory', [AdminInventoryController::class, 'index']);
            Route::put('inventory/{product}', [AdminInventoryController::class, 'update']);
        });
    });
});
