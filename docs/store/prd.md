# PRD — Pterodactyl Store (Payment: Bayarcash)

> Status: Draft v1.0 · 2026-08-08
> Repo: `panel-revanced` (fork Pterodactyl 1.12.2)

## 1. Ringkasan

Modul **Store** di dalam panel Pterodactyl (bukan panel terpisah). User membeli paket server (RAM/CPU/Disk), bayar via **Bayarcash** (gateway pembayaran Malaysia — FPX, DuitNow, e-wallet, QRIS, dst), lalu server Pterodactyl dibuat & diprovision otomatis.

Kode sudah berjalan ~40% (backend model/API/gateway). Sisa: koneksi frontend React, admin UI untuk kelola produk & setting gateway, plus sejumlah bug yang ditemukan saat audit.

## 2. Arsitektur

```
React SPA (client area)          Admin (Blade + AdminLTE)
└─ /store                        └─ /admin/store/*
   ├─ /store (katalog)              ├─ /admin/store/products
   ├─ /store/orders                 └─ /admin/store/settings
   └─ /store/checkout/{order}
        │  POST /api/client/store/checkout
        ▼
   StoreController ──► OrderService ──► createOrder (status=pending)
        │                                   │
        ▼                                   ▼
   PaymentManager ──► BayarcashGateway ──► Bayarcash SDK (webimpian/bayarcash-php-sdk ^3.0)
        │                                   │   POST payment-intents  → redirect user → Bayarcash page
        │                                   ▼
        │                              POST /api/store/callback/bayarcash  (webhook, no-auth, CSRF-exempt)
        │                                   │
        │                                   ▼
        │                    verifyTransactionCallbackData (checksum)
        │                                   │
        ▼                                   ▼
   return URL ◄───────────────────── OrderService::markPaid ──► provisionServer (ServerCreationService)
                                                                    │
                                                                    ▼
                                                              Server aktif di daemon
```

**Stack:**
- Backend: Laravel 11 (PHP 8.2/8.3), Eloquent, MySQL
- Payment SDK: `webimpian/bayarcash-php-sdk ^3.0` (sudah di `composer.json` & `composer.lock`, vendor keinstall)
- Frontend client: React + TS (SPA Pterodactyl existing) — `twin.macro`/Tailwind, mengikuti tema accent yang sudah ada
- Frontend admin: Blade + AdminLTE (existing pattern)

## 3. Status Saat Ini (Sudah Ada)

| Bagian | File | Status |
|---|---|---|
| Model produk | `app/Models/StoreProduct.php` | ✅ |
| Model order | `app/Models/StoreOrder.php` | ✅ |
| Model setting (key-value) | `app/Models/StoreSetting.php` | ✅ |
| Migration 3 tabel | `database/migrations/2026_08_08_000001_create_store_tables.php` | ✅ |
| Payment contract | `app/Contracts/Store/PaymentGateway.php` | ✅ |
| Gateway registry | `app/Services/Store/PaymentManager.php` | ✅ |
| Gateway Bayarcash | `app/Services/Store/BayarcashGateway.php` | ✅ |
| Order + provisioning | `app/Services/Store/OrderService.php` | ✅ |
| Client API | `app/Http/Controllers/Api/Client/Store/StoreController.php` | ✅ |
| Callback/return route | `app/Http/Controllers/Api/Client/Store/PaymentCallbackController.php` | ✅ |
| Webhook route | `routes/store-callback.php` | ✅ terpasang di `RouteServiceProvider` |
| Client API route | `routes/api-client.php` (`/store` group) | ✅ |
| CSRF exempt webhook | `app/Http/Middleware/VerifyCsrfToken.php` | ✅ |
| Admin StoreController | `app/Http/Controllers/Admin/StoreController.php` | ✅ |
| Admin routes | `routes/admin.php` (`/admin/store/*`) | ✅ |
| Admin views (index/edit/settings) | `resources/views/admin/store/` | ✅ |
| Admin sidebar link | `resources/views/layouts/admin.blade.php` | ✅ |
| API client (TS) | `resources/scripts/api/store.ts` | ✅ |
| Halaman katalog | `resources/scripts/components/store/StoreContainer.tsx` | ✅ |
| Halaman riwayat | `resources/scripts/components/store/StoreOrdersContainer.tsx` | ✅ |
| Routes React | `resources/scripts/routers/routes.ts` + `DashboardRouter.tsx` | ✅ |
| Navbar Store icon | `resources/scripts/components/NavigationBar.tsx` | ✅ |

## 4. Kebutuhan (Requirements)

### R4.1 — Katalog produk (client area)
- GET `/api/client/store/products` ✅ (aktif saja, urut `sort_order`)
- Halaman `/store` menampilkan: nama, deskripsi, harga (format RM), spec (RAM/CPU/Disk/backup/db/allocation), egg & node
- Tombol "Beli" → login user wajib

### R4.2 — Checkout & pembayaran
- POST `/api/client/store/checkout` `{product_id}` → buat `store_order` status `pending`, hit Bayarcash `createPaymentIntent`, balas `{order_id, order_number, payment_url}`
- Frontend redirect user ke `payment_url`
- Payment channel: configurable via admin (default FPX)
- Harga satuan: **sen (MYR)** di DB, tampil & kirim sebagai `RM x.xx` (2 desimal)

### R4.3 — Callback (webhook) & verifikasi
- POST `/api/store/callback/{gateway}` — **no auth, CSRF-exempt**, hanya urusan gateway
- Verifikasi checksum via SDK `verifyTransactionCallbackData`
- Status sukses → `OrderService::markPaid` (idempotent: sudah `paid` → skip)
- `markPaid` → set `paid`, `paid_at`, `gateway_ref` → **provision server** dalam transaksi DB

### R4.4 — Auto-provision server
- Pakai `ServerCreationService` (existing Pterodactyl) dengan spec produk
- Nama server: `<nama produk>-<order_id>`
- Egg variables: default value dari egg (overridable via admin)
- Pilih allocation kosong di node produk (kalau node produk ada) atau node mana pun yang available
- Kegagalan provision → order tetap `paid` (record), error di-log; retry manual dari admin

### R4.5 — Riwayat order (client)
- GET `/api/client/store/orders` ✅
- Halaman `/store/orders`: order_number, produk, amount, status, paid_at, server_id (link ke server kalau ada)
- Status: `pending|paid|failed|cancelled`

### R4.6 — Admin: kelola produk (Blade)
- CRUD `store_products`: name, desc, price, spec limits, node/egg/nest, image, active, sort_order
- Gunakan pattern admin existing (Controller + Request validasi + view Blade + route `/admin/store/*`)

### R4.7 — Admin: setting gateway (Blade)
- CRUD `store_settings` key-value:
  - `store_gateway` (default `bayarcash`)
  - `bayarcash_api_token`, `bayarcash_api_secret`
  - `bayarcash_portal_key`
  - `bayarcash_sandbox` (`1`/`0`)
  - `bayarcash_payment_channel`
- Halaman `/admin/store/settings`

## 5. Bug / Gap yang Ditemukan

Semua item di bawah **sudah diperbaiki** (status ✅):

1. ✅ **CSRF 419 pada webhook.** `VerifyCsrfToken.php` → tambah `api/store/callback/*` ke `$except`.
2. ✅ **Duplikasi checksum.** `BayarcashGateway` pakai SDK `createPaymentIntentChecksumValue`; hapus custom.
3. ✅ **Hardcode status.** `(int) $data['status'] === 3` → `Fpx::STATUS_SUCCESS`.
4. ✅ **`payer_telephone_number`** → setting admin `bayarcash_payer_telephone`.
5. ✅ **`provisionServer` rawan gagal** → fallback allocation any-node; validasi `egg_id`/`nest_id` di `createOrder` (throw `InvalidArgumentException` → 422).
6. ✅ **OrderService** di-inject ke `BayarcashGateway` (constructor DI, bukan `new`).
7. ✅ **Frontend & admin** sudah dibangun (katalog, riwayat, CRUD produk, settings gateway).

**Bonus bug (di luar store):**
- `VerifyReCaptcha.php` crash `TypeError` saat recaptcha off tapi config enabled — dispatch `FailedCaptcha` hanya kalau `$result->hostname` ada. Plus `.env` di-set `RECAPTCHA_ENABLED=false` (dev panel, tanpa key recaptcha). Tanpa ini, login di dev panel selalu gagal 400.

## 6. Alur Detil — Payment

### Create intent (SDK)
```php
$data = [
    'portal_key'      => setting('bayarcash_portal_key'),
    'payment_channel' => setting('bayarcash_payment_channel', Bayarcash::FPX),
    'order_number'    => $order->order_number,      // max 30 char
    'amount'          => number_format($order->amount / 100, 2, '.', ''), // RM string
    'payer_name'      => "$name_first $name_last",
    'payer_email'     => $user->email,
    'payer_telephone_number' => setting(...) atau null,
    'return_url'      => route('store.return', [...]),
    'callback_url'    => route('store.callback', ['gateway' => 'bayarcash']),
];
$data['checksum'] = $client->createPaymentIntentChecksumValue($apiSecret, $data);
$intent = $client->createPaymentIntent($data);   // ->url
```

### Callback (webhook)
```php
$client = app(BayarcashGateway::class);
$client->handleWebhook($request);
// di dalam: verifyTransactionCallbackData($request->all(), $secret)
// status === Fpx::STATUS_SUCCESS → app(OrderService::class)->markPaid($orderNumber, $data)
```

### Return URL
User diarahkan balik; frontend poll `/api/client/store/orders` sampai status berubah. Callback server-to-server adalah sumber kebenaran (source of truth), return URL hanya ack.

## 7. Konvensi Kode

- Namespace `Pterodactyl\*`, controller store di `app/Http/Controllers/Api/Client/Store/`
- Harga dalam **sen** (`bigInteger` unsigned) — konversi di layer API/UI, jangan di DB
- Setiap gateway implement `PaymentGateway` contract, daftarkan slug di `PaymentManager::$GATEWAYS`
- Idempotensi wajib: callback ganda tidak boleh double-provision
- UI client: komponen React di `resources/scripts/components/store/`, route di `routers/DashboardRouter.tsx` atau routes.ts, ikuti tema accent (`var(--accent)`) yang sudah dibangun
- UI admin: controller + view Blade di `resources/views/admin/store/`, route di `routes/admin.php`

## 8. Prioritas Pengerjaan

1. **P0 — Fix backend critical**: CSRF exempt, checksum SDK, `Fpx::STATUS_SUCCESS`, OrderService via container, validasi produk (biar webhook aman & provisioning tidak crash)
2. **P0 — Admin minimal**: kelola produk + setting gateway (Blade) — biar bisa config & test live
3. **P1 — Frontend client**: halaman katalog `/store`, checkout redirect, riwayat `/store/orders`
4. **P1 — Test end-to-end sandbox**: Bayarcash sandbox, simulasi callback
5. **P2 — Polish**: order status real-time (poll), retry provision, webhook log

## 9. Non-Goals (di luar scope v1)

- Panel terpisah / multi-tenant / reseller
- Recurring billing / langganan
- Support gateway selain Bayarcash di v1 (arsitektur sudah pluggable untuk nanti)
- Integrasi Discord/email notif lanjutan
- Diskusi di luar: silakan tambah section, jangan edit yang sudah disepakati tanpa tanya
