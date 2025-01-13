<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pedidos_proveedores', function (Blueprint $table) {
            $table->string('codigo_pedido')->after('id')->nullable()->index(); // Campo nuevo con índice
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pedidos_proveedores', function (Blueprint $table) {
            $table->dropColumn('codigo_pedido'); // Eliminar el campo si se revierte la migración
        });
    }
};
