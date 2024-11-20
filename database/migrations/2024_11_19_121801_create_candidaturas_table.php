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
        Schema::create('candidaturas', function (Blueprint $table) {
            $table->id(); // ID de la candidatura
            $table->string('localizador')->unique(); // Código único de la candidatura
            $table->string('nombre'); // Nombre del candidato
            $table->string('email'); // Email del candidato
            $table->string('cv'); // Ruta del archivo PDF del CV
            $table->enum('estado', ['entregado', 'denegado', 'en bolsa de empleo'])->default('entregado'); // Estado de la candidatura
            $table->unsignedBigInteger('user_id')->nullable(); // Relación opcional con la tabla users
            $table->unsignedBigInteger('oferta_id'); // Relación con la tabla ofertas
            $table->timestamps(); // Timestamps: created_at y updated_at

            // Relaciones
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('oferta_id')->references('id')->on('ofertas')->onDelete('cascade');

            // Restricción única para evitar que un usuario se postule más de una vez a la misma oferta
            $table->unique(['user_id', 'oferta_id']);
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('candidaturas');
    }
};
