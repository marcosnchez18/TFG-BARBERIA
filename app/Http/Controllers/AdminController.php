<?php
namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Cita;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class AdminController extends Controller
{
    public function dashboard()
    {
        $barberoId = Auth::id(); // ID del barbero autenticado
        $today = Carbon::today();
        $startOfMonth = $today->copy()->startOfMonth();
        $endOfMonth = $today->copy()->endOfMonth();

        // Obtiene el nombre del mes actual en español
        $nombreMesActual = $today->translatedFormat('F');

        // Citas de hoy
        $citasHoy = Cita::whereDate('fecha_hora_cita', $today)
            ->where('barbero_id', $barberoId)
            ->count();

        // Nuevos usuarios registrados hoy con rol cliente
        $nuevosUsuariosHoy = User::where('rol', 'cliente')
            ->whereDate('created_at', $today)
            ->count();

        // Ganancias estimadas del mes actual
        $gananciasMes = Cita::where('barbero_id', $barberoId)
            ->whereBetween('fecha_hora_cita', [$startOfMonth, $endOfMonth])
            ->whereIn('metodo_pago', ['adelantado', 'efectivo'])
            ->join('servicios', 'citas.servicio_id', '=', 'servicios.id')
            ->sum('servicios.precio');

        return Inertia::render('AdminDashboard', [
            'user' => Auth::user(),
            'citasHoy' => $citasHoy,
            'nuevosUsuariosHoy' => $nuevosUsuariosHoy,
            'gananciasMes' => $gananciasMes,
            'nombreMesActual' => ucfirst($nombreMesActual), // Capitaliza el mes actual
        ]);
    }
}
