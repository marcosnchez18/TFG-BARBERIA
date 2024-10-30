<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Cita;
use Carbon\Carbon;

class UpdateCitasCompletadas extends Command
{
    protected $signature = 'citas:update-completadas';
    protected $description = 'Marca como completadas las citas cuyo horario ya ha pasado';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $now = Carbon::now();

        // Actualiza citas con fecha y hora pasada
        $citasActualizadas = Cita::where('fecha_hora_cita', '<', $now)
            ->where('estado', 'pendiente')
            ->update(['estado' => 'completada']);

        $this->info("Citas completadas: {$citasActualizadas}");
    }
}
