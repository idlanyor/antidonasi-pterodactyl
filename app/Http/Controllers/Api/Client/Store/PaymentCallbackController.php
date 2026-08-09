<?php

namespace Pterodactyl\Http\Controllers\Api\Client\Store;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Pterodactyl\Http\Controllers\Controller;
use Pterodactyl\Services\Store\PaymentManager;

class PaymentCallbackController extends Controller
{
    public function __construct(private PaymentManager $payments)
    {
    }

    /**
     * Handle an incoming payment webhook from a gateway.
     */
    public function callback(Request $request, string $gateway): JsonResponse
    {
        try {
            $this->payments->gateway($gateway)->handleWebhook($request);
        } catch (\Throwable $exception) {
            report($exception);

            return new JsonResponse(['error' => 'Webhook handling failed.'], 500);
        }

        return new JsonResponse(['status' => 'ok']);
    }

    /**
     * Return URL a payer is sent to after payment. Redirect back to the client
     * store orders page; the frontend polls for the order status.
     */
    public function return(Request $request, string $gateway, int $order)
    {
        if ($request->user()) {
            return redirect('/store/orders');
        }

        return redirect('/checkout/success/'.$order);
    }
}
