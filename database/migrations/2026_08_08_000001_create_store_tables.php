<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class () extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('store_products', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->text('description')->nullable();
            $table->bigInteger('price')->unsigned(); // price in sen (myr cents)
            $table->integer('memory')->unsigned();
            $table->integer('disk')->unsigned();
            $table->integer('cpu')->unsigned();
            $table->integer('swap')->default(0);
            $table->integer('backup_limit')->default(0);
            $table->integer('database_limit')->default(0);
            $table->integer('allocation_limit')->default(1);
            $table->unsignedInteger('node_id')->nullable();
            $table->unsignedInteger('egg_id');
            $table->unsignedInteger('nest_id');
            $table->string('image')->default('ghcr.io/parkervcp/yolks:generic');
            $table->boolean('active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->foreign('node_id')->references('id')->on('nodes')->onDelete('SET NULL');
            $table->foreign('egg_id')->references('id')->on('eggs');
            $table->foreign('nest_id')->references('id')->on('nests');
        });

        Schema::create('store_orders', function (Blueprint $table) {
            $table->increments('id');
            $table->string('order_number', 32)->unique();
            $table->unsignedInteger('user_id');
            $table->unsignedInteger('product_id');
            $table->bigInteger('amount'); // price in sen
            $table->string('status', 20)->default('pending'); // pending|paid|failed|cancelled
            $table->string('gateway', 30)->nullable();
            $table->string('gateway_ref', 191)->nullable();
            $table->unsignedInteger('server_id')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('product_id')->references('id')->on('store_products');
            $table->foreign('server_id')->references('id')->on('servers')->onDelete('SET NULL');
        });

        Schema::create('store_settings', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->text('value')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('store_settings');
        Schema::dropIfExists('store_orders');
        Schema::dropIfExists('store_products');
    }
};
