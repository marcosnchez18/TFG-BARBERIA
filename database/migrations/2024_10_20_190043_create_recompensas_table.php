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
        Schema::create('recompensas', function (Blueprint $table) {
            $table->id();
            $table->string('cliente_referente_id'); // Número de tarjeta VIP del cliente referente
            $table->string('cliente_referido_id'); // Número de tarjeta VIP del cliente referido
            $table->decimal('monto_referencia', 8, 2)->default(2.00); // 2€ para ambos
            $table->timestamps();

            // Llaves foráneas referenciando la tarjeta VIP
            $table->foreign('cliente_referente_id')->references('numero_tarjeta_vip')->on('users')->onDelete('cascade');
            $table->foreign('cliente_referido_id')->references('numero_tarjeta_vip')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recompensas');
    }
};
