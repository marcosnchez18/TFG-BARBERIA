<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Servicio;

class ServicioUsuarioController extends Controller
{
    public function asignarServicios(Request $request)
    {
        $request->validate([
            'barbero_id' => 'required|exists:users,id',
            'servicios' => 'required|array',
            'servicios.*' => 'exists:servicios,id',
        ]);

        $barbero = User::where('id', $request->barbero_id)
            ->whereIn('rol', ['admin', 'trabajador'])
            ->first();

        if (!$barbero) {
            return response()->json(['message' => 'El barbero seleccionado no es válido.'], 400);
        }

        $nuevosServicios = [];
        foreach ($request->servicios as $servicioId) {
            $existe = $barbero->servicios()->where('servicio_id', $servicioId)->exists();

            if ($existe) {
                return response()->json([
                    'message' => 'El servicio ya ha sido asignado previamente a este barbero.'
                ], 400);
            }

            $nuevosServicios[] = ['servicio_id' => $servicioId];
        }

        $barbero->servicios()->attach($request->servicios);

        return response()->json([
            'message' => 'Los servicios han sido asignados correctamente.'
        ]);
    }

    public function getServiciosAsignados($barberoId)
{
    $barbero = User::findOrFail($barberoId);
    $servicios = $barbero->servicios()->get();
    return response()->json($servicios);
}

public function desasignarServicio(Request $request)
{
    $request->validate([
        'barbero_id' => 'required|exists:users,id',
        'servicio_id' => 'required|exists:servicios,id',
    ]);

    $barbero = User::findOrFail($request->barbero_id);
    $barbero->servicios()->detach($request->servicio_id);

    return response()->json(['message' => 'Servicio desasignado correctamente']);
}

}
