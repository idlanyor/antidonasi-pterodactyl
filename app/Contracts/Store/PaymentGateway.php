<?php

namespace Pterodactyl\Contracts\Store;

use Illuminate\Http\Request;
use Pterodactyl\Models\StoreOrder;

interface PaymentGateway
{
    /**
     * Human-readable name of the gateway.
     */
    public function name(): string;

    /**
     * Create a payment for the given order. Returns a redirect/payment URL
     * that the user is sent to, or null if the order is paid synchronously.
     */
    public function createPayment(StoreOrder $order): ?string;

    /**
     * Handle an incoming webhook/callback. Must be idempotent.
     */
    public function handleWebhook(Request $request): void;
}
