<?php

namespace App\Http\Controllers;

use App\Mail\ConfirmacionCitaMail;
use App\Models\Cita;
use App\Notifications\CitaModificada;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;
use Inertia\Inertia;

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

    /**
     * Cancela una cita y envía una alerta de confirmación.
     */
    public function cancelar(Request $request, $id)
    {
        // Verifica si la cita existe y pertenece al usuario autenticado
        $cita = Cita::where('id', $id)
            ->where('usuario_id', Auth::id())
            ->first();

        if (!$cita) {
            return response()->json(['error' => 'No tienes citas para cancelar.'], 404);
        }

        // Elimina la cita
        $cita->delete();

        // Retorna respuesta con mensaje de confirmación para SweetAlert
        return response()->json([
            'success' => 'Cita cancelada exitosamente. Se ha solicitado la devolución del importe. Será ingresado en tu cuenta de PayPal de 3 a 5 días laborables.'
        ]);
    }

    public function misCitas()
    {
        // ID del usuario autenticado
        $usuarioId = Auth::id();

        // Obtener citas con joins para incluir detalles del barbero y servicio
        $citas = Cita::where('usuario_id', $usuarioId)
            ->with(['barbero:id,nombre', 'servicio:id,nombre,precio']) // Cargar barbero y servicio con sus datos relevantes
            ->get();

        return Inertia::render('MisCitasCliente', [
            'citas' => $citas,
        ]);
    }

    public function modificar(Request $request, $id)
{
    // Validar la solicitud entrante
    $request->validate([
        'servicio_id' => 'required|exists:servicios,id',
        'fecha_hora_cita' => 'required|date_format:Y-m-d H:i',
    ]);

    try {
        // Buscar la cita por su ID
        $cita = Cita::findOrFail($id);

        // Actualizar los datos de la cita
        $cita->servicio_id = $request->input('servicio_id');
        $cita->fecha_hora_cita = $request->input('fecha_hora_cita');
        $cita->save();

        // Responder con éxito
        return response()->json(['message' => 'Cita modificada con éxito.'], 200);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Error al modificar la cita.'], 500);
    }
}


}
