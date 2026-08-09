<?php

namespace Pterodactyl\Services\Store;

use Illuminate\Contracts\Container\Container;
use Pterodactyl\Contracts\Store\PaymentGateway;
use Pterodactyl\Models\StoreSetting;

class PaymentManager
{
    /**
     * Map of gateway slugs to their implementation class names.
     */
    protected const GATEWAYS = [
        'bayarcash' => BayarcashGateway::class,
    ];

    public function __construct(private Container $container)
    {
    }

    /**
     * Get the gateway instance by slug.
     */
    public function gateway(?string $slug = null): PaymentGateway
    {
        $slug = $slug ?? StoreSetting::get('store_gateway', 'bayarcash');

        $class = static::GATEWAYS[$slug] ?? throw new \InvalidArgumentException("Unsupported payment gateway: {$slug}");

        return $this->container->make($class);
    }

    /**
     * List all available gateway slugs.
     */
    public function available(): array
    {
        return array_keys(static::GATEWAYS);
    }
}
