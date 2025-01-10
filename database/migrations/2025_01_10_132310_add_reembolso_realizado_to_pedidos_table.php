<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::table('pedidos', function (Blueprint $table) {
        $table->boolean('reembolso_realizado')->default(false);
    });
}


    /**
     * Reverse the migrations.
     */
    public function down()
{
    Schema::table('pedidos', function (Blueprint $table) {
        $table->dropColumn('reembolso_realizado');
    });
}
};
