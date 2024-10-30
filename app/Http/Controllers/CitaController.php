<?php

namespace App\Http\Controllers;

use App\Mail\ConfirmacionCitaMail;
use App\Models\Cita;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class CitaController extends Controller
{
    /**
     * Muestra la disponibilidad de días y horarios.
     */
    public function disponibilidad(Request $request)
    {
        $disponibilidad = [];
        $hoy = Carbon::today();
        $barberoId = $request->input('barbero_id');

        for ($i = 0; $i < 30; $i++) {
            $fecha = $hoy->copy()->addDays($i);
            $fechaStr = $fecha->toDateString();

            if ($fecha->isSunday()) {
                $disponibilidad[$fechaStr] = ['completo' => true];
            } elseif ($fecha->isSaturday()) {
                $totalCitas = Cita::whereDate('fecha_hora_cita', $fecha)
                    ->where('barbero_id', $barberoId)
                    ->whereBetween(DB::raw('HOUR(fecha_hora_cita)'), [10, 13])
                    ->count();
                $disponibilidad[$fechaStr] = ['completo' => $totalCitas >= 5];
            } else {
                $totalCitas = Cita::whereDate('fecha_hora_cita', $fecha)
                    ->where('barbero_id', $barberoId)
                    ->count();
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

        $fecha_hora_cita = Carbon::parse($request->fecha_hora_cita);

        $existeCita = Cita::where('barbero_id', $request->barbero_id)
                          ->where('fecha_hora_cita', $fecha_hora_cita)
                          ->exists();

        if ($existeCita) {
            return response()->json(['error' => 'Este horario ya está reservado para el barbero seleccionado.'], 422);
        }

        $cita = Cita::create([
            'usuario_id' => Auth::id(),
            'barbero_id' => $request->barbero_id,
            'servicio_id' => $request->servicio_id,
            'fecha_hora_cita' => $fecha_hora_cita,
            'estado' => 'pendiente',
            'metodo_pago' => 'pendiente'  // Inicializa con 'pendiente'
        ]);

        $user = Auth::user();
        Mail::to($user->email)->send(new ConfirmacionCitaMail($cita, $user));

        return response()->json(['success' => '¡Cita reservada exitosamente!', 'cita_id' => $cita->id]);
    }

    /**
     * Muestra las horas reservadas para una fecha y barbero específicos.
     */
    public function horasReservadas(Request $request)
    {
        $fecha = $request->input('fecha');
        $barberoId = $request->input('barbero_id');

        $horasReservadas = Cita::whereDate('fecha_hora_cita', $fecha)
            ->where('barbero_id', $barberoId)
            ->pluck('fecha_hora_cita')
            ->map(function ($fechaHora) {
                return Carbon::parse($fechaHora)->format('H:i');
            });

        return response()->json($horasReservadas);
    }

    /**
     * Actualiza el método de pago de la cita.
     */
    public function actualizarMetodoPago(Request $request, $id)
    {
        $request->validate([
            'metodo_pago' => 'required|in:adelantado,efectivo'
        ]);

        $cita = Cita::findOrFail($id);
        $cita->metodo_pago = $request->metodo_pago;
        $cita->save();

        return response()->json(['success' => 'Método de pago actualizado']);
    }
}
