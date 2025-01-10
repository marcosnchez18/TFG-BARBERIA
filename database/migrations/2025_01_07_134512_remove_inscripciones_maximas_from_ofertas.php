<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Ejecutar la migración.
     */
    public function up(): void
    {
        Schema::table('ofertas', function (Blueprint $table) {
            $table->dropColumn('inscripciones_maximas');
        });
    }

    /**
     * Revertir la migración.
     */
    public function down(): void
    {
        Schema::table('ofertas', function (Blueprint $table) {
            $table->integer('inscripciones_maximas')->default(0); 
        });
    }
};
