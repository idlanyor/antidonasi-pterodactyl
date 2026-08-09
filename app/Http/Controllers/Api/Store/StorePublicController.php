<?php

namespace Pterodactyl\Http\Controllers\Api\Store;

use Bayarcash\Bayarcash;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Pterodactyl\Http\Controllers\Controller;
use Pterodactyl\Models\StoreOrder;
use Pterodactyl\Models\StoreProduct;
use Pterodactyl\Services\Store\OrderService;
use Pterodactyl\Services\Store\PaymentManager;

class StorePublicController extends Controller
{
    public function __construct(
        private OrderService $orders,
        private PaymentManager $payments,
    ) {
    }

    /**
     * List active store products — public, for the landing pricing page.
     */
    public function products(): JsonResponse
    {
        $products = StoreProduct::query()
            ->where('active', true)
            ->with(['egg:id,name', 'node:id,name'])
            ->orderBy('sort_order')
            ->orderBy('price')
            ->get()
            ->map(fn (StoreProduct $p) => $this->productPayload($p));

        return new JsonResponse(['data' => $products]);
    }

    /**
     * Available Bayarcash payment channels.
     */
    public function channels(): JsonResponse
    {
        $channels = [
            ['id' => (string) Bayarcash::FPX, 'name' => 'FPX (Malaysia Online Banking)', 'logo' => 'fpx'],
            ['id' => (string) Bayarcash::DUITNOW_QR, 'name' => 'DuitNow QR', 'logo' => 'duitnow'],
            ['id' => (string) Bayarcash::QRISOB, 'name' => 'QRIS (OVO/GoPay/Dana)', 'logo' => 'qris'],
            ['id' => (string) Bayarcash::QRISWALLET, 'name' => 'QRIS Wallet', 'logo' => 'qris'],
        ];

        return new JsonResponse(['data' => $channels]);
    }

    /**
     * Start a guest checkout for a product. Creates an anonymous order and
     * returns the Bayarcash payment URL.
     */
    public function checkout(Request $request): JsonResponse
    {
        $request->validate([
            'product_id' => 'required|integer|exists:store_products,id',
            'channel' => 'nullable|integer|in:1,6,9,10',
            'name' => 'required|string|max:191',
            'email' => 'required|email|max:191',
            'telephone' => 'nullable|string|max:30',
        ]);

        $product = StoreProduct::query()->where('id', $request->input('product_id'))->where('active', true)->first();

        if (!$product) {
            return new JsonResponse(['error' => 'Product not found.'], 404);
        }

        try {
            $order = $this->orders->createGuestOrder($product, [
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'telephone' => $request->input('telephone'),
                'channel' => $request->input('channel'),
            ]);
        } catch (\InvalidArgumentException $exception) {
            return new JsonResponse(['error' => $exception->getMessage()], 422);
        }

        try {
            $url = $this->payments->gateway()->createPayment($order);
        } catch (\Throwable $exception) {
            $order->update(['status' => StoreOrder::STATUS_FAILED]);

            return new JsonResponse(['error' => 'Could not start payment: '.$exception->getMessage()], 422);
        }

        return new JsonResponse([
            'data' => [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'payment_url' => $url,
            ],
        ]);
    }

    /**
     * Public order status lookup — used by the guest success page after the
     * payer returns from the gateway.
     */
    public function order(Request $request, int $order): JsonResponse
    {
        $row = StoreOrder::query()->with(['product:id,name'])->find($order);

        if (!$row) {
            return new JsonResponse(['error' => 'Order not found.'], 404);
        }

        return new JsonResponse([
            'data' => [
                'id' => $row->id,
                'order_number' => $row->order_number,
                'amount' => $row->amount,
                'status' => $row->status,
                'product' => $row->product->name ?? null,
                'server_id' => $row->server_id,
            ],
        ]);
    }

    protected function productPayload(StoreProduct $p): array
    {
        return [
            'id' => $p->id,
            'name' => $p->name,
            'description' => $p->description,
            'price' => $p->price,
            'memory' => $p->memory,
            'disk' => $p->disk,
            'cpu' => $p->cpu,
            'backup_limit' => $p->backup_limit,
            'database_limit' => $p->database_limit,
            'allocation_limit' => $p->allocation_limit,
            'egg' => $p->egg->name ?? null,
            'node' => $p->node->name ?? null,
        ];
    }
}
