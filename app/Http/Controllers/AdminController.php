<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Cita;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function dashboard()
    {
        $barberoId = Auth::id();
        $today = Carbon::today();
        $startOfMonth = $today->copy()->startOfMonth();
        $endOfMonth = $today->copy()->endOfMonth();

        // Mes actual en español
        $nombreMesActual = $today->locale('es')->translatedFormat('F');

        // Contar citas de hoy para el barbero logueado
        $citasHoy = Cita::whereDate('fecha_hora_cita', $today)
            ->where('barbero_id', $barberoId)
            ->count();

        // Contar usuarios nuevos hoy con rol de cliente
        $nuevosUsuariosHoy = User::where('rol', 'cliente')
            ->whereDate('created_at', $today)
            ->count();

        // Ganancias del mes actual
        $gananciasMes = Cita::where('barbero_id', $barberoId)
            ->whereBetween('fecha_hora_cita', [$startOfMonth, $endOfMonth])
            ->whereIn('metodo_pago', ['adelantado', 'efectivo'])
            ->join('servicios', 'citas.servicio_id', '=', 'servicios.id')
            ->sum('servicios.precio');

        // Calcular valoración media de citas completadas del barbero
        $valoracionMedia = Cita::where('barbero_id', $barberoId)
            ->where('estado', 'completada')
            ->whereNotNull('valoracion')
            ->avg('valoracion');

        return Inertia::render('AdminDashboard', [
            'user' => Auth::user(),
            'citasHoy' => $citasHoy,
            'nuevosUsuariosHoy' => $nuevosUsuariosHoy,
            'gananciasMes' => $gananciasMes,
            'nombreMesActual' => ucfirst($nombreMesActual),
            'valoracionMedia' => $valoracionMedia ? round($valoracionMedia, 2) : 'N/A',
        ]);
    }

    public function citasBarbero()
    {
        if (Auth::user()->rol !== 'admin') {
            return response()->json(['error' => 'Acceso no autorizado'], 403);
        }

        $barberoId = Auth::id();

        // Filtrar las citas pendientes y futuras del barbero logueado
        $citas = Cita::where('barbero_id', $barberoId)
            ->where('fecha_hora_cita', '>=', Carbon::now())
            ->where('estado', 'pendiente')
            ->with(['usuario:id,nombre', 'servicio:id,nombre'])
            ->orderBy('fecha_hora_cita', 'asc')
            ->get();

        return response()->json($citas);
    }

    public function cambiarEstado(Request $request, $id)
    {
        $cita = Cita::findOrFail($id);
        $nuevoEstado = $request->input('estado');

        if (in_array($nuevoEstado, ['completada', 'ausente', 'pendiente'])) {
            $cita->estado = $nuevoEstado;
            $cita->save();

            return response()->json(['success' => true, 'estado' => $nuevoEstado]);
        }

        return response()->json(['success' => false, 'message' => 'Estado no válido'], 400);
    }

    public function cancelarCita($id)
    {
        $cita = Cita::findOrFail($id);
        $cita->delete();

        return response()->json(['message' => 'Cita cancelada exitosamente.']);
    }


    public function citasPorDia($fecha)
    {
        $barberoId = Auth::id();
        $fechaSeleccionada = Carbon::parse($fecha)->startOfDay();

        $citas = Cita::where('barbero_id', $barberoId)
            ->whereDate('fecha_hora_cita', $fechaSeleccionada)
            ->with(['usuario:id,nombre', 'servicio:id,nombre'])
            ->orderBy('fecha_hora_cita', 'asc')
            ->get();

        return response()->json($citas);
    }
}
