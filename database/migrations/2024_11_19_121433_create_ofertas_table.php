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
        Schema::create('ofertas', function (Blueprint $table) {
            $table->id();
            $table->string('nombre'); // Nombre de la oferta
            $table->text('descripcion'); // Descripción detallada de la oferta
            $table->integer('duracion_meses'); // Duración de la oferta en meses
            $table->integer('numero_vacantes'); // Número de vacantes disponibles
            $table->integer('inscripciones_maximas'); // Número máximo de inscripciones permitidas
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ofertas');
    }
};
