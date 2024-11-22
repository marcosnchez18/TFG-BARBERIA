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
    Schema::create('users', function (Blueprint $table) {
        $table->id();
        $table->string('nombre');
        $table->string('email')->unique();
        $table->timestamp('email_verified_at')->nullable();
        $table->string('password');
        $table->enum('rol', ['admin', 'cliente', 'trabajador'])->default('cliente'); 
        $table->decimal('saldo', 8, 2)->default(0);
        $table->integer('contador_ausencias')->default(0);
        $table->enum('estado', ['activo', 'inactivo'])->default('activo');
        $table->string('numero_tarjeta_vip')->unique()->nullable();
        $table->string('referido_por')->nullable();
        $table->rememberToken();
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
