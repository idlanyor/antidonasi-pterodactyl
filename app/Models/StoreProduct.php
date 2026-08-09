<?php

namespace Pterodactyl\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property int $price
 * @property int $memory
 * @property int $disk
 * @property int $cpu
 * @property int $swap
 * @property int $backup_limit
 * @property int $database_limit
 * @property int $allocation_limit
 * @property int|null $node_id
 * @property int $egg_id
 * @property int $nest_id
 * @property string $image
 * @property bool $active
 * @property int $sort_order
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property \Pterodactyl\Models\Node $node
 * @property \Pterodactyl\Models\Egg $egg
 * @property \Pterodactyl\Models\Nest $nest
 * @property \Pterodactyl\Models\StoreOrder[] $orders
 */
class StoreProduct extends Model
{
    /**
     * The table associated with the model.
     */
    protected $table = 'store_products';

    /**
     * Fields that are not mass assignable.
     */
    protected $guarded = ['id', 'created_at', 'updated_at'];

    /**
     * Rules for validating the product.
     */
    public static array $validationRules = [
        'name' => 'required|string|max:191',
        'description' => 'nullable|string',
        'price' => 'required|integer|min:0',
        'memory' => 'required|integer|min:16',
        'disk' => 'required|integer|min:16',
        'cpu' => 'required|integer|min:0',
        'swap' => 'nullable|integer',
        'backup_limit' => 'nullable|integer',
        'database_limit' => 'nullable|integer',
        'allocation_limit' => 'nullable|integer',
        'node_id' => 'nullable|integer|exists:nodes,id',
        'egg_id' => 'required|integer|exists:eggs,id',
        'nest_id' => 'required|integer|exists:nests,id',
        'image' => 'nullable|string',
        'active' => 'nullable|boolean',
        'sort_order' => 'nullable|integer',
    ];

    public function node(): BelongsTo
    {
        return $this->belongsTo(Node::class);
    }

    public function egg(): BelongsTo
    {
        return $this->belongsTo(Egg::class);
    }

    public function nest(): BelongsTo
    {
        return $this->belongsTo(Nest::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(StoreOrder::class, 'product_id');
    }
}
