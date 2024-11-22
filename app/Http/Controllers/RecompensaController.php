<?php

namespace App\Http\Controllers;

use App\Models\Cita;
use App\Models\Recompensa;
use App\Models\Servicio;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class RecompensaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Recompensa $recompensa)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Recompensa $recompensa)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Recompensa $recompensa)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Recompensa $recompensa)
    {
        //
    }

    public function getServiciosPorBarbero($barberoId)
{
    $barbero = User::findOrFail($barberoId);

    if (!in_array($barbero->rol, ['admin', 'trabajador'])) {
        return response()->json(['message' => 'El usuario seleccionado no es un barbero.'], 400);
    }

    // Selecciona columnas específicas con alias para evitar ambigüedad
    $servicios = $barbero->servicios()
        ->select(
            'servicios.id as servicio_id',
            'servicios.nombre',
            'servicios.descripcion',
            'servicios.precio',
            'servicios.duracion'
        )
        ->get();

    return response()->json($servicios);
}

public function disponibilidad(Request $request)
{
    try {
        $barberoId = $request->input('barbero_id');
        $fechaSeleccionada = $request->input('fecha');
        $servicioId = $request->input('servicio_id');

        // Si faltan parámetros, retornar una lista vacía en lugar de un error
        if (!$barberoId || !$fechaSeleccionada || !$servicioId) {
            Log::warning('Faltan parámetros necesarios para disponibilidad:', [
                'barbero_id' => $barberoId,
                'fecha' => $fechaSeleccionada,
                'servicio_id' => $servicioId
            ]);
            return response()->json([]);
        }

        // Verificar que no se permita reservar el día actual
        $hoy = Carbon::today();
        if (Carbon::parse($fechaSeleccionada)->isSameDay($hoy)) {
            return response()->json([]); // Retorna lista vacía si es el día actual
        }

        // Obtener la duración del servicio seleccionado
        $servicio = Servicio::findOrFail($servicioId);
        $duracionServicio = $servicio->duracion;

        // Define horarios de trabajo y ajusta para los sábados
        $esSabado = Carbon::parse($fechaSeleccionada)->isSaturday();
        $horariosTrabajo = $esSabado
            ? [['inicio' => '10:00', 'fin' => '14:00']] // Horario de sábado
            : [['inicio' => '10:00', 'fin' => '14:00'], ['inicio' => '16:00', 'fin' => '20:00']]; // Horario normal

        // Obtener citas ya reservadas para ese día y barbero
        $citas = Cita::where('barbero_id', $barberoId)
            ->whereDate('fecha_hora_cita', $fechaSeleccionada)
            ->get();

        $horariosDisponibles = [];

        // Calcular intervalos para cada bloque horario
        foreach ($horariosTrabajo as $rango) {
            $inicio = Carbon::parse("{$fechaSeleccionada} {$rango['inicio']}");
            $fin = Carbon::parse("{$fechaSeleccionada} {$rango['fin']}");

            while ($inicio->lessThan($fin)) {
                $finIntervalo = $inicio->copy()->addMinutes($duracionServicio);
                $esOcupado = false;

                // Verificar si este intervalo se solapa con alguna cita existente
                foreach ($citas as $cita) {
                    $inicioCita = Carbon::parse($cita->fecha_hora_cita);
                    $finCita = $inicioCita->copy()->addMinutes($cita->servicio->duracion);

                    if (
                        $inicio->lessThan($finCita) &&
                        $finIntervalo->greaterThan($inicioCita)
                    ) {
                        $esOcupado = true;
                        break;
                    }
                }

                if (!$esOcupado && $finIntervalo->lessThanOrEqualTo($fin)) {
                    $horariosDisponibles[] = $inicio->format('H:i');
                }

                // Avanza al siguiente intervalo de tiempo
                $inicio->addMinutes($duracionServicio);
            }
        }

        return response()->json($horariosDisponibles);

    } catch (\Exception $e) {
        Log::error("Error en la disponibilidad: " . $e->getMessage());
        return response()->json(['error' => 'Error al obtener disponibilidad'], 500);
    }
}

}
