<?php

namespace App\Http\Controllers;

use App\Mail\CancelacionCitaMail;
use App\Mail\ConfirmacionCitaMail;
use App\Models\Cita;
use App\Models\Servicio;
use App\Notifications\CitaModificada;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;


class CitaController extends Controller
{
    /**
     * Muestra la disponibilidad de días y horarios.
     */
    public function disponibilidad(Request $request)
{
    try {
        $disponibilidad = [];
        $hoy = Carbon::today();
        $barberoId = $request->input('barbero_id');

        if (!$barberoId) {
            Log::warning('El ID del barbero es necesario');
            return response()->json(['error' => 'El ID del barbero es necesario'], 400);
        }

        for ($i = 0; $i < 30; $i++) {
            $fecha = $hoy->copy()->addDays($i);
            $fechaStr = $fecha->toDateString();

            if ($fecha->isSunday()) {
                $disponibilidad[$fechaStr] = ['completo' => true];
            } elseif ($fecha->isSaturday()) {

                $totalCitas = Cita::whereDate('fecha_hora_cita', $fecha)
                    ->where('barbero_id', $barberoId)
                    ->whereRaw('EXTRACT(HOUR FROM fecha_hora_cita) BETWEEN 10 AND 13')
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

    } catch (\Exception $e) {
        Log::error("Error en la disponibilidad: " . $e->getMessage(), [
            'barbero_id' => $request->input('barbero_id'),
            'trace' => $e->getTraceAsString()
        ]);

        return response()->json(['error' => 'Error al obtener disponibilidad'], 500);
    }
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
        'descuento_aplicado' => 'nullable|numeric|min:0',
        'precio_cita' => 'nullable|numeric|min:0',
    ]);

    try {
        $fecha_hora_cita = Carbon::parse($request->fecha_hora_cita);

        $existeCita = Cita::where('barbero_id', $request->barbero_id)
                          ->where('fecha_hora_cita', $fecha_hora_cita)
                          ->exists();

        if ($existeCita) {
            return response()->json(['error' => 'Este horario ya está reservado para el barbero seleccionado.'], 422);
        }


        $servicio = Servicio::findOrFail($request->servicio_id);
        $precioCita = $servicio->precio - $request->input('descuento_aplicado', 0);

        // Crear la cita con el precio final y el descuento aplicado
        $cita = Cita::create([
            'usuario_id' => Auth::id(),
            'barbero_id' => $request->barbero_id,
            'servicio_id' => $request->servicio_id,
            'fecha_hora_cita' => $fecha_hora_cita,
            'estado' => 'pendiente',
            'metodo_pago' => 'pendiente',
            'descuento_aplicado' => $request->input('descuento_aplicado', 0),
            'precio_cita' => $precioCita,
        ]);

        Log::info('Descuento aplicado a la cita:', [
            'descuento' => $request->input('descuento_aplicado'),
            'precio_cita' => $precioCita
        ]);

        // Enviar correo de confirmación
        $user = Auth::user();
        Mail::to($user->email)->send(new ConfirmacionCitaMail($cita, $user));

        return response()->json(['success' => '¡Cita reservada exitosamente!', 'cita_id' => $cita->id]);

    } catch (\Exception $e) {
        Log::error('Error al reservar cita: ' . $e->getMessage());
        return response()->json(['error' => 'Ocurrió un problema al reservar la cita.'], 500);
    }
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
    // Busca la cita del usuario autenticado, incluyendo la relación con servicio y barbero
    $cita = Cita::where('id', $id)
        ->where('usuario_id', Auth::id())
        ->with(['servicio', 'barbero'])
        ->first();

    if (!$cita) {
        return response()->json(['error' => 'No tienes citas para cancelar.'], 404);
    }


    if ($cita->descuento_aplicado > 0) {
        $usuario = $cita->usuario;
        $usuario->saldo += $cita->descuento_aplicado;
        $usuario->save();
    }


    $mensajeExplicacion = $request->input('mensajeExplicacion');
    $servicio = $cita->servicio ? $cita->servicio->nombre : 'No especificado';
    $barbero = $cita->barbero ? $cita->barbero->nombre : 'No especificado';


    Mail::to('barbers18sanlucar@gmail.com')->send(new CancelacionCitaMail($cita->usuario, $cita->fecha_hora_cita, $servicio, $barbero, $mensajeExplicacion));


    $cita->delete();

    return response()->json([
        'success' => 'Cita cancelada exitosamente. Se ha solicitado la devolución del importe. Será ingresado en tu cuenta de PayPal de 3 a 5 días laborables.'
    ]);
}




    public function misCitas()
    {

        $usuarioId = Auth::id();


        $citas = Cita::where('usuario_id', $usuarioId)
            ->with(['barbero:id,nombre', 'servicio:id,nombre,precio'])
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


        return response()->json(['message' => 'Cita modificada con éxito.'], 200);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Error al modificar la cita.'], 500);
    }
}

public function calificar(Request $request, $id)
{
    $request->validate(['valoracion' => 'required|integer|min:1|max:5']);

    $cita = Cita::findOrFail($id);
    if ($cita->estado === 'completada') {
        $cita->valoracion = $request->input('valoracion');
        $cita->save();

        return response()->json(['message' => 'Valoración guardada exitosamente.']);
    }

    return response()->json(['error' => 'Solo puedes valorar citas completadas.'], 400);
}

public function citasDelDia(Request $request)
    {
        // Usa la fecha de hoy si no se especifica en la solicitud
        $fecha = $request->input('fecha', Carbon::today()->toDateString());
        $barberoId = Auth::id();

        $citas = Cita::whereDate('fecha_hora_cita', $fecha)
            ->where('barbero_id', $barberoId)
            ->with(['usuario', 'servicio']) 
            ->get();

        return response()->json($citas);
    }
}
