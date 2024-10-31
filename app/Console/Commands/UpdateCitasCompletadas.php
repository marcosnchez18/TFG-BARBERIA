<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Cita;
use Carbon\Carbon;

class UpdateCitasCompletadas extends Command
{
    protected $signature = 'citas:update-completadas';
    protected $description = 'Marca como completadas las citas cuyo horario ya ha pasado por más de 45 minutos';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        // Hora actual menos 45 minutos
        $timeThreshold = Carbon::now()->subMinutes(45);

        // Actualiza citas con fecha y hora pasada por más de 45 minutos
        $citasActualizadas = Cita::where('fecha_hora_cita', '<', $timeThreshold)
            ->where('estado', 'pendiente')
            ->update(['estado' => 'completada']);

        $this->info("Citas completadas: {$citasActualizadas}");
    }
}
