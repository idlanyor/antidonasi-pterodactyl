<?php

use Illuminate\Support\Facades\Route;
use Pterodactyl\Http\Controllers\Api\Client\Store\PaymentCallbackController;
use Pterodactyl\Http\Controllers\Api\Store\StorePublicController;

// Public store catalog for the landing/pricing page (no auth).
Route::get('/store/public/products', [StorePublicController::class, 'products'])->name('store.public.products');
Route::get('/store/public/channels', [StorePublicController::class, 'channels'])->name('store.public.channels');
Route::post('/store/public/checkout', [StorePublicController::class, 'checkout'])->name('store.public.checkout');
Route::get('/store/public/orders/{order}', [StorePublicController::class, 'order'])->name('store.public.order');

Route::post('/store/callback/{gateway}', [PaymentCallbackController::class, 'callback'])->name('store.callback');
Route::get('/store/callback/{gateway}/return/{order}', [PaymentCallbackController::class, 'return'])->name('store.return');
