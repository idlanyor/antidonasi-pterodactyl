<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * Allow guest (anonymous) orders: user_id becomes nullable so a checkout
     * can happen before the payer has an account. The customer is resolved to
     * a user once payment succeeds.
     */
    public function up(): void
    {
        Schema::table('store_orders', function (Blueprint $table) {
            $table->unsignedInteger('user_id')->nullable()->change();
            $table->string('customer_name', 191)->nullable();
            $table->string('customer_email', 191)->nullable();
            $table->string('customer_telephone', 30)->nullable();
            $table->smallInteger('payment_channel')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('store_orders', function (Blueprint $table) {
            $table->dropColumn(['customer_name', 'customer_email', 'customer_telephone', 'payment_channel']);
            $table->unsignedInteger('user_id')->nullable(false)->change();
        });
    }
};
