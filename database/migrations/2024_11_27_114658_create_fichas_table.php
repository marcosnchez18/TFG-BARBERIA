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
        Schema::create('fichas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('color', ['rubio', 'castaño', 'negro', 'pelirrojo'])->nullable();
            $table->boolean('tinte')->default(false);
            $table->json('colores_usados')->nullable(); // Colores usados (JSON para lista desplegable)
            $table->enum('tipo_pelo', ['liso', 'ondulado', 'rizado', 'muy rizado', 'afro'])->nullable();
            $table->enum('tipo_rostro', [
                'ovalado',
                'cuadrado',
                'cuadrado largo',
                'redondo',
                'triangular ovalado',
                'triangular',
                'triangular invertido',
            ])->nullable();
            $table->enum('tipo_corte', ['clásico', 'degradado', 'largo', 'rapado'])->nullable();
            $table->boolean('barba')->default(false);
            $table->enum('tipo_barba', ['larga', 'tres días', 'degradada', 'pico'])->nullable();
            $table->enum('textura', ['grueso', 'delgado', 'mediano', 'fino'])->nullable();
            $table->enum('canas', ['nada', 'pocas', 'muchas'])->nullable();
            $table->boolean('injerto_capilar')->default(false);
            $table->enum('estado', ['graso', 'seco', 'medio'])->nullable();
            $table->text('deseos')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fichas');
    }
};
