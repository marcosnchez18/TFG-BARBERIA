<?php

namespace App\Http\Controllers;

use App\Models\Cita;
use App\Models\Servicio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CitaController extends Controller
{
    /**
     * Muestra la disponibilidad de días y horarios.
     */
    public function disponibilidad()
    {
        $disponibilidad = [];
        $hoy = Carbon::today();

        // Obtener días con citas completadas o agotadas para el calendario
        for ($i = 0; $i < 30; $i++) {
            $fecha = $hoy->copy()->addDays($i);
            $fechaStr = $fecha->toDateString();

            if ($fecha->isSunday()) {
                $disponibilidad[$fechaStr] = ['completo' => true]; // Domingo cerrado
            } elseif ($fecha->isSaturday()) {
                // Sábados, verificar disponibilidad de 10:00 a 14:00
                $totalCitas = Cita::whereDate('fecha_hora_cita', $fecha)
                                  ->whereBetween(DB::raw('HOUR(fecha_hora_cita)'), [10, 14])
                                  ->count();
                $disponibilidad[$fechaStr] = ['completo' => $totalCitas >= 5];
            } else {
                // Días entre semana, verificar disponibilidad completa en el horario
                $totalCitas = Cita::whereDate('fecha_hora_cita', $fecha)->count();
                $disponibilidad[$fechaStr] = ['completo' => $totalCitas >= 12];
            }
        }

        return response()->json($disponibilidad);
    }

    /**
     * Almacena una nueva cita en la base de datos.
     */
    public function reservar(Request $request)
    {
        $request->validate([
            'barbero_id' => 'required|exists:users,id',
            'servicio_id' => 'required|exists:servicios,id',
            'fecha_hora_cita' => 'required|date',
        ]);

        // Comprobar si la hora y el barbero están disponibles
        $fecha_hora_cita = Carbon::parse($request->fecha_hora_cita);
        $existeCita = Cita::where('barbero_id', $request->barbero_id)
                          ->where('fecha_hora_cita', $fecha_hora_cita)
                          ->exists();

        if ($existeCita) {
            return response()->json(['error' => 'Este horario ya está reservado para el barbero seleccionado.'], 422);
        }

        // Crear la cita
        Cita::create([
            'usuario_id' => Auth::id(),
            'barbero_id' => $request->barbero_id,
            'servicio_id' => $request->servicio_id,
            'fecha_hora_cita' => $fecha_hora_cita,
            'estado' => 'pendiente',
        ]);

        return response()->json(['success' => '¡Cita reservada exitosamente!']);
    }
}
