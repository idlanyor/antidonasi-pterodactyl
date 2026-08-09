<?php

namespace Pterodactyl\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;
use Pterodactyl\Services\Users\UserCreationService;

/**
 * @property int $id
 * @property string $order_number
 * @property int $user_id
 * @property int $product_id
 * @property int $amount
 * @property string $status
 * @property string|null $gateway
 * @property string|null $gateway_ref
 * @property int|null $server_id
 * @property \Carbon\Carbon|null $paid_at
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property \Pterodactyl\Models\User $user
 * @property \Pterodactyl\Models\StoreProduct $product
 * @property \Pterodactyl\Models\Server|null $server
 */
class StoreOrder extends Model
{
    public const STATUS_PENDING = 'pending';
    public const STATUS_PAID = 'paid';
    public const STATUS_FAILED = 'failed';
    public const STATUS_CANCELLED = 'cancelled';

    /**
     * The table associated with the model.
     */
    protected $table = 'store_orders';

    /**
     * Fields that are not mass assignable.
     */
    protected $guarded = ['id', 'created_at', 'updated_at'];

    /**
     * Fields that should be cast to native types.
     */
    protected $casts = [
        'paid_at' => 'datetime',
    ];

    /**
     * Rules for validating the order.
     */
    public static array $validationRules = [
        'order_number' => 'required|string|max:32|unique:store_orders',
        'user_id' => 'nullable|integer|exists:users,id',
        'product_id' => 'required|integer|exists:store_products,id',
        'amount' => 'required|integer|min:0',
        'status' => 'required|in:pending,paid,failed,cancelled',
        'gateway' => 'nullable|string|max:30',
        'gateway_ref' => 'nullable|string|max:191',
        'server_id' => 'nullable|integer|exists:servers,id',
        'customer_name' => 'nullable|string|max:191',
        'customer_email' => 'nullable|string|max:191',
        'customer_telephone' => 'nullable|string|max:30',
        'payment_channel' => 'nullable|integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Resolve the user for this order — the linked account, or a freshly
     * created one from the guest's customer contact details. Idempotent.
     *
     * @throws \Pterodactyl\Exceptions\Model\DataValidationException
     */
    public function resolveUser(UserCreationService $users): User
    {
        if ($this->user_id) {
            return User::query()->findOrFail($this->user_id);
        }

        $email = $this->customer_email;

        if ($email && ($existing = User::query()->where('email', $email)->first())) {
            return $existing;
        }

        $user = $users->handle([
            'username' => $this->username(),
            'email' => $email ?? Str::random(16).'@guest.local',
            'name_first' => $this->namePart(0),
            'name_last' => $this->namePart(1),
            'language' => 'en',
        ]);

        $this->forceFill(['user_id' => $user->id])->save();

        return $user;
    }

    /**
     * Unique-but-stable username for a guest account, reusing the (collision
     * safe) order number as the suffix.
     */
    public function username(): string
    {
        return Str::lower(Str::slug($this->customer_name ?: 'guest')).'-'.strtolower($this->order_number);
    }

    protected function namePart(int $index): ?string
    {
        $parts = array_values(array_filter(array_map('trim', preg_split('/\s+/', (string) $this->customer_name))));

        return $parts[$index] ?? null;
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(StoreProduct::class, 'product_id');
    }

    public function server(): BelongsTo
    {
        return $this->belongsTo(Server::class);
    }
}
