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
        Schema::create('citas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('barbero_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('servicio_id')->constrained('servicios')->onDelete('cascade');
            $table->enum('estado', ['pendiente', 'completada', 'ausente'])->default('pendiente');
            $table->dateTime('fecha_hora_cita');
            $table->integer('valoracion')->nullable(); 
            $table->enum('metodo_pago', ['pendiente', 'adelantado', 'efectivo'])->default('pendiente');
            $table->decimal('descuento_aplicado', 8, 2)->nullable();
            $table->decimal('precio_cita', 8, 2)->nullable()->after('descuento_aplicado');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('citas');
    }
};
