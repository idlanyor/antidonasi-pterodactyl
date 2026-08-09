<?php

namespace Pterodactyl\Services\Store;

use Bayarcash\Bayarcash;
use Bayarcash\Fpx;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Pterodactyl\Contracts\Store\PaymentGateway;
use Pterodactyl\Models\StoreOrder;
use Pterodactyl\Models\StoreSetting;
use Pterodactyl\Models\User;

class BayarcashGateway implements PaymentGateway
{
    public function __construct(
        private OrderService $orders,
    ) {
    }

    public function name(): string
    {
        return 'Bayarcash';
    }

    /**
     * Build a configured Bayarcash SDK client from stored settings.
     */
    protected function client(): Bayarcash
    {
        $token = StoreSetting::get('bayarcash_api_token', '');
        $client = new Bayarcash($token);

        if (StoreSetting::get('bayarcash_sandbox', '1') === '1') {
            $client->useSandbox();
        }

        $client->setApiVersion('v3');

        return $client;
    }

    /**
     * Create a Bayarcash payment intent for an order and return the redirect URL.
     */
    public function createPayment(StoreOrder $order): ?string
    {
        $user = $order->user_id ? User::query()->find($order->user_id) : null;

        $data = [
            'portal_key' => StoreSetting::get('bayarcash_portal_key', ''),
            'order_number' => $order->order_number,
            'amount' => number_format($order->amount / 100, 2, '.', ''),
            'payer_name' => $order->customer_name ?: ($user ? trim($user->name_first.' '.$user->name_last) : 'Guest'),
            'payer_email' => $order->customer_email ?: $user->email,
            'payer_telephone_number' => $order->customer_telephone ?: StoreSetting::get('bayarcash_payer_telephone', ''),
            'callback_url' => route('store.callback', ['gateway' => 'bayarcash']),
            'return_url' => route('store.return', ['gateway' => 'bayarcash', 'order' => $order->id]),
            'payment_channel' => (string) ($order->payment_channel ?: StoreSetting::get('bayarcash_payment_channel', (string) Bayarcash::FPX)),
        ];

        $data['checksum'] = $this->client()->createPaymentIntentChecksumValue(
            StoreSetting::get('bayarcash_api_secret', ''),
            $data
        );

        try {
            $response = $this->client()->createPaymentIntent($data);
        } catch (\Throwable $exception) {
            Log::error('Bayarcash payment intent failed: '.$exception->getMessage(), [
                'order' => $order->order_number,
            ]);

            throw $exception;
        }

        if (empty($response->url)) {
            throw new \RuntimeException('Bayarcash did not return a payment URL.');
        }

        $order->update([
            'gateway' => 'bayarcash',
            'gateway_ref' => $response->id ?? null,
        ]);

        return $response->url;
    }

    /**
     * Verify and handle the Bayarcash transaction callback.
     */
    public function handleWebhook(Request $request): void
    {
        $data = $request->all();
        $secret = StoreSetting::get('bayarcash_api_secret', '');

        $verified = $this->client()->verifyTransactionCallbackData($data, $secret);

        if (!$verified) {
            Log::warning('Bayarcash callback checksum verification failed.', $data);

            return;
        }

        $orderNumber = $data['order_number'] ?? null;
        $status = (int) ($data['status'] ?? -1);

        if ($status === Fpx::STATUS_SUCCESS && $orderNumber) {
            $this->orders->markPaid($orderNumber, $data);
        }
    }
}
