<?php

namespace Pterodactyl\Services\Store;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Pterodactyl\Models\StoreOrder;
use Pterodactyl\Models\StoreProduct;
use Pterodactyl\Models\User;
use Pterodactyl\Models\Allocation;
use Pterodactyl\Services\Servers\ServerCreationService;
use Pterodactyl\Services\Users\UserCreationService;

class OrderService
{
    public function __construct(
        private ServerCreationService $creationService,
        private UserCreationService $users,
    ) {
    }

    /**
     * Create a new order for a user and product.
     */
    public function createOrder(User $user, StoreProduct $product): StoreOrder
    {
        if (!$product->egg_id || !$product->nest_id) {
            throw new \InvalidArgumentException('Product requires an egg and nest.');
        }

        $order = StoreOrder::create([
            'order_number' => $this->generateOrderNumber(),
            'user_id' => $user->id,
            'product_id' => $product->id,
            'amount' => $product->price,
            'status' => StoreOrder::STATUS_PENDING,
        ]);

        return $order;
    }

    /**
     * Create an order for a guest (possibly unauthenticated) customer. The
     * account is created lazily when the payment is confirmed. When a
     * customer_email matches an existing user, that account gets the server.
     */
    public function createGuestOrder(StoreProduct $product, array $customer): StoreOrder
    {
        if (!$product->egg_id || !$product->nest_id) {
            throw new \InvalidArgumentException('Product requires an egg and nest.');
        }

        return StoreOrder::create([
            'order_number' => $this->generateOrderNumber(),
            'user_id' => null,
            'product_id' => $product->id,
            'amount' => $product->price,
            'status' => StoreOrder::STATUS_PENDING,
            'customer_name' => $customer['name'] ?? null,
            'customer_email' => $customer['email'] ?? null,
            'customer_telephone' => $customer['telephone'] ?? null,
            'payment_channel' => $customer['channel'] ?? null,
        ]);
    }

    /**
     * Generate a unique, human-friendly order number.
     */
    protected function generateOrderNumber(): string
    {
        do {
            $number = 'BC-'.strtoupper(Str::random(8));
        } while (StoreOrder::query()->where('order_number', $number)->exists());

        return $number;
    }

    /**
     * Mark an order as paid and provision the server. Idempotent.
     */
    public function markPaid(string $orderNumber, array $gatewayData = []): void
    {
        $order = StoreOrder::query()->where('order_number', $orderNumber)->first();

        if (!$order || $order->status === StoreOrder::STATUS_PAID) {
            return;
        }

        DB::transaction(function () use ($order, $gatewayData) {
            $order->forceFill([
                'status' => StoreOrder::STATUS_PAID,
                'paid_at' => now(),
                'gateway_ref' => $gatewayData['transaction_id'] ?? $order->gateway_ref,
            ])->save();

            $order->resolveUser($this->users);

            $serverId = $this->provisionServer($order);
            $order->forceFill(['server_id' => $serverId])->save();
        });
    }

    /**
     * Create the Pterodactyl server for a paid order using the product's spec.
     */
    protected function provisionServer(StoreOrder $order): int
    {
        $product = $order->product;
        $allocation = $this->findAvailableAllocation($product);

        $data = [
            'owner_id' => $order->user_id,
            'name' => Str::limit($product->name, 40).'-'.$order->id,
            'node_id' => $product->node_id ?? $allocation?->node_id,
            'allocation_id' => $allocation?->id,
            'memory' => $product->memory,
            'swap' => $product->swap,
            'disk' => $product->disk,
            'cpu' => $product->cpu,
            'io' => 500,
            'feature_limits' => [
                'allocations' => $product->allocation_limit,
                'databases' => $product->database_limit,
                'backups' => $product->backup_limit,
            ],
            'egg_id' => $product->egg_id,
            'nest_id' => $product->nest_id,
            'startup' => $product->egg->startup ?? null,
            'image' => $product->image,
            'environment' => $this->eggEnvironment($product),
            'start_on_completion' => true,
        ];

        $server = $this->creationService->handle($data);

        return $server->id;
    }

    /**
     * Pick a free allocation on the product's node, falling back to any free
     * allocation if the product node is full or unset.
     */
    protected function findAvailableAllocation(StoreProduct $product): ?Allocation
    {
        $query = Allocation::query()->whereNull('server_id');

        if ($product->node_id) {
            $found = (clone $query)->where('node_id', $product->node_id)->first();

            if ($found) {
                return $found;
            }
        }

        return $query->first();
    }

    /**
     * Build sensible default environment variables for the egg.
     */
    protected function eggEnvironment(StoreProduct $product): array
    {
        $environment = [];

        foreach ($product->egg->variables as $variable) {
            $environment[$variable->env_variable] = $variable->default_value ?? '';
        }

        return $environment;
    }
}
