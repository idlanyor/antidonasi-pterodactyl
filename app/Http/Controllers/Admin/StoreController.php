<?php

namespace Pterodactyl\Http\Controllers\Admin;

use Illuminate\View\View;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Prologue\Alerts\AlertsMessageBag;
use Pterodactyl\Models\Egg;
use Pterodactyl\Models\Nest;
use Pterodactyl\Models\Node;
use Pterodactyl\Models\StoreProduct;
use Pterodactyl\Models\StoreSetting;
use Pterodactyl\Http\Controllers\Controller;
use Pterodactyl\Services\Store\PaymentManager;

class StoreController extends Controller
{
    /**
     * StoreController constructor.
     */
    public function __construct(
        private AlertsMessageBag $alert,
        private PaymentManager $payments,
    ) {
    }

    /**
     * Render product list.
     */
    public function index(): View
    {
        return view('admin.store.index', [
            'products' => StoreProduct::query()->with(['egg:id,name', 'node:id,name'])->orderBy('sort_order')->get(),
        ]);
    }

    /**
     * Render product create/edit form.
     */
    public function view(Request $request, int $id = null): View
    {
        return view('admin.store.edit', [
            'product' => $id ? StoreProduct::query()->findOrFail($id) : null,
            'nodes' => Node::query()->orderBy('name')->get(['id', 'name']),
            'eggs' => Egg::query()->with('nest:id,name')->get(['id', 'name', 'nest_id']),
            'nests' => Nest::query()->get(['id', 'name']),
        ]);
    }

    /**
     * Store or update a product.
     */
    public function store(Request $request, int $id = null): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:191'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'integer', 'min:0'],
            'memory' => ['required', 'integer', 'min:16'],
            'disk' => ['required', 'integer', 'min:16'],
            'cpu' => ['required', 'integer', 'min:0'],
            'swap' => ['nullable', 'integer'],
            'backup_limit' => ['nullable', 'integer'],
            'database_limit' => ['nullable', 'integer'],
            'allocation_limit' => ['nullable', 'integer'],
            'node_id' => ['nullable', 'integer', 'exists:nodes,id'],
            'egg_id' => ['required', 'integer', 'exists:eggs,id'],
            'nest_id' => ['required', 'integer', 'exists:nests,id'],
            'image' => ['nullable', 'string', 'max:191'],
            'active' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $data['active'] = $request->boolean('active');
        $data['swap'] = (int) ($data['swap'] ?? 0);
        $data['backup_limit'] = (int) ($data['backup_limit'] ?? 0);
        $data['database_limit'] = (int) ($data['database_limit'] ?? 0);
        $data['allocation_limit'] = (int) ($data['allocation_limit'] ?? 1);
        $data['sort_order'] = (int) ($data['sort_order'] ?? 0);
        $data['image'] = $data['image'] ?? 'ghcr.io/parkervcp/yolks:generic';

        $product = $id
            ? StoreProduct::query()->findOrFail($id)
            : new StoreProduct();

        $product->fill($data)->save();

        $this->alert->success('Produk store berhasil disimpan.')->flash();

        return redirect()->route('admin.store.edit', $product->id);
    }

    /**
     * Delete a product.
     */
    public function delete(int $id): RedirectResponse
    {
        $product = StoreProduct::query()->findOrFail($id);

        if ($product->orders()->exists()) {
            $this->alert->danger('Produk punya order terkait, tidak bisa dihapus.')->flash();

            return redirect()->route('admin.store.index');
        }

        $product->delete();

        $this->alert->success('Produk store berhasil dihapus.')->flash();

        return redirect()->route('admin.store.index');
    }

    /**
     * Render gateway settings.
     */
    public function settings(): View
    {
        return view('admin.store.settings', [
            'gateways' => $this->payments->available(),
            'settings' => [
                'store_gateway' => StoreSetting::get('store_gateway', 'bayarcash'),
                'bayarcash_api_token' => StoreSetting::get('bayarcash_api_token', ''),
                'bayarcash_api_secret' => StoreSetting::get('bayarcash_api_secret', ''),
                'bayarcash_portal_key' => StoreSetting::get('bayarcash_portal_key', ''),
                'bayarcash_sandbox' => StoreSetting::get('bayarcash_sandbox', '1'),
                'bayarcash_payment_channel' => StoreSetting::get('bayarcash_payment_channel', '1'),
                'bayarcash_payer_telephone' => StoreSetting::get('bayarcash_payer_telephone', ''),
            ],
        ]);
    }

    /**
     * Save gateway settings.
     */
    public function saveSettings(Request $request): RedirectResponse
    {
        $request->validate([
            'store_gateway' => ['required', 'in:'.implode(',', $this->payments->available())],
            'bayarcash_api_token' => ['nullable', 'string'],
            'bayarcash_api_secret' => ['nullable', 'string'],
            'bayarcash_portal_key' => ['nullable', 'string'],
            'bayarcash_sandbox' => ['nullable', 'in:0,1'],
            'bayarcash_payment_channel' => ['nullable', 'string'],
            'bayarcash_payer_telephone' => ['nullable', 'string'],
        ]);

        foreach ([
            'store_gateway',
            'bayarcash_api_token',
            'bayarcash_api_secret',
            'bayarcash_portal_key',
            'bayarcash_sandbox',
            'bayarcash_payment_channel',
            'bayarcash_payer_telephone',
        ] as $key) {
            StoreSetting::set($key, $request->input($key, ''));
        }

        $this->alert->success('Pengaturan gateway berhasil disimpan.')->flash();

        return redirect()->route('admin.store.settings');
    }
}
