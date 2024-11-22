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
     * Muestra la disponibilidad de días y horarios
     */
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
            'metodo_pago' => 'efectivo',
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
    $servicioId = $request->input('servicio_id');

    // Validar que todos los parámetros estén presentes
    if (!$fecha || !$barberoId || !$servicioId) {
        return response()->json(['error' => 'Faltan parámetros necesarios.'], 400);
    }

    // Obtener la duración del servicio seleccionado
    $servicio = Servicio::findOrFail($servicioId);
    $duracionServicio = $servicio->duracion;

    // Horarios de trabajo del barbero
    $horariosTrabajo = [
        ['inicio' => '10:00', 'fin' => '14:00'],
        ['inicio' => '16:00', 'fin' => '20:00']
    ];

    // Obtener todas las citas reservadas para ese día y barbero
    $citas = Cita::where('barbero_id', $barberoId)
        ->whereDate('fecha_hora_cita', $fecha)
        ->get();

    $horariosDisponibles = [];

    // Iterar por cada bloque de horario de trabajo
    foreach ($horariosTrabajo as $rango) {
        $inicioBloque = Carbon::parse("{$fecha} {$rango['inicio']}");
        $finBloque = Carbon::parse("{$fecha} {$rango['fin']}");

        // Generar intervalos en base a la duración del servicio
        while ($inicioBloque->addMinutes($duracionServicio)->lessThanOrEqualTo($finBloque)) {
            $finIntervalo = $inicioBloque->copy()->addMinutes($duracionServicio);
            $solapado = false;

            // Verificar solapamiento con citas existentes
            foreach ($citas as $cita) {
                $inicioCita = Carbon::parse($cita->fecha_hora_cita);
                $finCita = $inicioCita->copy()->addMinutes($cita->servicio->duracion);

                if ($inicioBloque->between($inicioCita, $finCita->subMinute()) ||
                    $finIntervalo->between($inicioCita->addMinute(), $finCita)) {
                    $solapado = true;
                    break;
                }
            }

            if (!$solapado) {
                $horariosDisponibles[] = $inicioBloque->format('H:i');
            }

            // Avanzar al siguiente intervalo de tiempo
            $inicioBloque->addMinutes($duracionServicio);
        }
    }

    return response()->json($horariosDisponibles);
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
            ->with(['barbero:id,nombre', 'servicio:id,nombre,precio,duracion'])
            ->get();

        return Inertia::render('MisCitasCliente', [
            'citas' => $citas,
        ]);
    }

    public function modificar(Request $request, $id)
{
    try {
        $request->validate([
            'servicio_id' => 'required|exists:servicios,id',
            'fecha_hora_cita' => 'required|date_format:Y-m-d H:i',
        ]);

        // Obtener la cita actual
        $cita = Cita::findOrFail($id);

        // Eliminar la cita existente
        $cita->delete();

        // Preparar los datos para crear una nueva cita
        $data = $request->only(['servicio_id', 'fecha_hora_cita']);
        $data['barbero_id'] = $cita->barbero_id;
        $data['descuento_aplicado'] = $cita->descuento_aplicado;
        $data['precio_cita'] = $cita->precio_cita;

        // Llamar al método reservar
        return $this->reservar(new Request($data));
    } catch (\Exception $e) {
        Log::error('Error al modificar la cita:', [
            'message' => $e->getMessage(),
            'trace' => $e->getTrace()
        ]);
        return response()->json(['error' => 'Error interno al modificar la cita.'], 500);
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
