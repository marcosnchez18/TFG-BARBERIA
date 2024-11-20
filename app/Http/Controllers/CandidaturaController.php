<?php

namespace App\Http\Controllers;

use App\Mail\CandidaturaRegistradaMail;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Candidatura;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class CandidaturaController extends Controller
{
    /**
     * Verificar si el cliente existe en la base de datos.
     */
    public function verificarCliente(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user) {
            return response()->json([
                'is_valid' => true,
                'nombre' => $user->nombre,
                'user_id' => $user->id,
            ]);
        }

        return response()->json(['is_valid' => false], 404);
    }

    /**
     * Guardar la candidatura del cliente o no cliente.
     */
    public function guardarCandidatura(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'cv' => 'required|mimes:pdf|max:2048',
        'oferta_id' => 'required|exists:ofertas,id',
        'nombre' => 'nullable|string|max:255', // Solo para no clientes
    ]);

    // Verificar si ya se inscribió a la misma oferta
    $existing = Candidatura::where('email', $request->email)
        ->where('oferta_id', $request->oferta_id)
        ->first();

    if ($existing) {
        return response()->json([
            'success' => false,
            'error' => 'already_applied',
        ], 400);
    }

    // Guardar el archivo PDF en la carpeta 'pdf' dentro de 'public'
    $cvPath = $request->file('cv')->store('pdf', 'public');

    // Verificar si el usuario ya existe
    $user = User::where('email', $request->email)->first();

    // Generar localizador único
    $localizador = Str::uuid();

    // Crear la candidatura
    $candidatura = Candidatura::create([
        'localizador' => $localizador,
        'nombre' => $user ? $user->nombre : $request->nombre,
        'email' => $request->email,
        'cv' => $cvPath,
        'estado' => 'entregado',
        'user_id' => $user ? $user->id : null,
        'oferta_id' => $request->oferta_id,
    ]);

    // Enviar correo
    Mail::to($request->email)->send(new CandidaturaRegistradaMail($candidatura->nombre, $localizador));

    return response()->json([
        'success' => true,
        'message' => 'Candidatura registrada exitosamente.',
        'localizador' => $localizador,
    ]);
}

public function consultarEstado(Request $request)
    {
        $request->validate([
            'localizador' => 'required|string',
        ]);

        // Buscar la candidatura por el localizador
        $candidatura = Candidatura::where('localizador', $request->localizador)->first();

        if (!$candidatura) {
            return response()->json([
                'success' => false,
                'error' => 'not_found',
                'message' => 'No se encontró ninguna candidatura con este localizador.',
            ], 404);
        }

        // Mensaje según el estado de la candidatura
        $mensaje = '';
        switch ($candidatura->estado) {
            case 'entregado':
                $mensaje = '¡Tu candidatura ha sido entregada exitosamente! Estamos revisando tu perfil.';
                break;
            case 'denegado':
                $mensaje = 'Lamentablemente, tu candidatura no ha sido seleccionada. Te animamos a seguir participando en nuestras futuras ofertas.';
                break;
            case 'en bolsa de empleo':
                $mensaje = 'Tu perfil ha sido añadido a nuestra bolsa de empleo. ¡Recuerda estar atento a tu móvil y correo electrónico por si te contactamos para ofrecerte una entrevista!';
                break;
            default:
                $mensaje = 'Estado desconocido. Por favor, contacta con soporte.';
        }

        return response()->json([
            'success' => true,
            'estado' => $candidatura->estado,
            'mensaje' => $mensaje,
        ]);
    }

    public function verCandidatos($ofertaId)
{
    $candidaturas = Candidatura::where('oferta_id', $ofertaId)->get();

    return inertia('Candidatos', [
        'candidaturas' => $candidaturas,
    ]);
}


public function cambiarEstado(Request $request, $id)
{
    $request->validate([
        'estado' => 'required|string|in:entregado,denegado,en bolsa de empleo',
    ]);

    $candidatura = Candidatura::findOrFail($id);
    $candidatura->estado = $request->estado;
    $candidatura->save();

    return back()->with('success', 'Estado actualizado correctamente.');
}




}
