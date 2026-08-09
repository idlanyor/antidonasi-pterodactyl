<?php

namespace Pterodactyl\Http\Controllers\Api\Client\Store;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Pterodactyl\Http\Controllers\Api\Client\ClientApiController;
use Pterodactyl\Models\StoreOrder;
use Pterodactyl\Models\StoreProduct;
use Pterodactyl\Services\Store\OrderService;
use Pterodactyl\Services\Store\PaymentManager;

class StoreController extends ClientApiController
{
    public function __construct(
        private OrderService $orders,
        private PaymentManager $payments,
    ) {
    }

    /**
     * List active store products.
     */
    public function products(): JsonResponse
    {
        $products = StoreProduct::query()
            ->where('active', true)
            ->with(['egg:id,name', 'node:id,name'])
            ->orderBy('sort_order')
            ->orderBy('price')
            ->get()
            ->map(fn (StoreProduct $p) => [
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
            ]);

        return new JsonResponse(['data' => $products]);
    }

    /**
     * Create an order for a product and return the payment URL.
     */
    public function checkout(Request $request): JsonResponse
    {
        $request->validate(['product_id' => 'required|integer|exists:store_products,id']);

        $product = StoreProduct::query()->where('id', $request->input('product_id'))->where('active', true)->first();

        if (!$product) {
            return new JsonResponse(['error' => 'Product not found.'], 404);
        }

        try {
            $order = $this->orders->createOrder($request->user(), $product);
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
     * Retry payment for an existing pending/failed order.
     */
    public function retry(Request $request): JsonResponse
    {
        $order = StoreOrder::query()
            ->where('id', $request->input('order_id'))
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$order) {
            return new JsonResponse(['error' => 'Order not found.'], 404);
        }

        if ($order->status !== StoreOrder::STATUS_PENDING && $order->status !== StoreOrder::STATUS_FAILED) {
            return new JsonResponse(['error' => 'Order cannot be retried.'], 422);
        }

        $order->update(['status' => StoreOrder::STATUS_PENDING]);

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
     * List the authenticated user's orders.
     */
    public function orders(Request $request): JsonResponse
    {
        $orders = StoreOrder::query()
            ->where('user_id', $request->user()->id)
            ->with(['product:id,name'])
            ->orderByDesc('id')
            ->get()
            ->map(fn (StoreOrder $o) => [
                'id' => $o->id,
                'order_number' => $o->order_number,
                'amount' => $o->amount,
                'status' => $o->status,
                'product' => $o->product->name ?? null,
                'created_at' => $o->created_at?->toIso8601String(),
                'paid_at' => $o->paid_at?->toIso8601String(),
                'server_id' => $o->server_id,
            ]);

        return new JsonResponse(['data' => $orders]);
    }
}
