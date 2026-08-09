<?php

namespace Pterodactyl\Models;

/**
 * @property string $key
 * @property string|null $value
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class StoreSetting extends Model
{
    /**
     * The table associated with the model.
     */
    protected $table = 'store_settings';

    /**
     * The primary key for the model.
     */
    protected $primaryKey = 'key';

    /**
     * Indicates if the model's ID is auto-incrementing.
     */
    public $incrementing = false;

    /**
     * The "type" of the primary key.
     */
    protected $keyType = 'string';

    /**
     * Fields that are not mass assignable.
     */
    protected $guarded = ['created_at', 'updated_at'];

    /**
     * Get a setting value, falling back to the provided default.
     */
    public static function get(string $key, ?string $default = null): ?string
    {
        $row = static::query()->find($key);

        return $row?->value ?? $default;
    }

    /**
     * Set a setting value.
     */
    public static function set(string $key, ?string $value): void
    {
        static::query()->updateOrCreate(['key' => $key], ['value' => $value]);
    }
}
