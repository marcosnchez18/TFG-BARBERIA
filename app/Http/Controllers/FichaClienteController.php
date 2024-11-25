<?php

namespace App\Http\Controllers;
use Barryvdh\DomPDF\Facade\Pdf;

use App\Models\FichaCliente;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FichaClienteController extends Controller
{
    public function show()
    {
        // Obtiene la ficha del cliente autenticado
        $ficha = FichaCliente::where('user_id', auth()->id())->first();

        // Retorna la vista con la ficha y el usuario autenticado
        return Inertia::render('Ficha', [
            'ficha' => $ficha,
            'user' => auth()->user(),
        ]);
    }

    public function update(Request $request, $id)
{
    $request->validate([
        'color' => 'nullable|in:rubio,castaño,negro,pelirrojo',
        'tinte' => 'required|boolean',
        'colores_usados' => 'nullable|array',
        'colores_usados.*' => 'string',
        'tipo_pelo' => 'nullable|in:liso,ondulado,rizado,muy rizado,afro',
        'tipo_rostro' => 'nullable|in:ovalado,cuadrado,cuadrado largo,redondo,triangular ovalado,triangular,triangular invertido',
        'tipo_corte' => 'nullable|in:clásico,degradado,largo,rapado',
        'barba' => 'required|boolean',
        'tipo_barba' => 'nullable|in:larga,tres días,degradada,pico',
        'textura' => 'nullable|in:grueso,delgado,mediano,fino',
        'canas' => 'nullable|in:nada,pocas,muchas',
        'injerto_capilar' => 'required|boolean',
        'estado' => 'nullable|in:graso,seco,medio',
        'deseos' => 'nullable|string|max:1000',
    ]);

    FichaCliente::updateOrCreate(
        ['user_id' => $id],
        [
            'color' => $request->input('color', null),
            'tinte' => $request->boolean('tinte'),
            'colores_usados' => $request->input('colores_usados', null),
            'tipo_pelo' => $request->input('tipo_pelo', null),
            'tipo_rostro' => $request->input('tipo_rostro', null),
            'tipo_corte' => $request->input('tipo_corte', null),
            'barba' => $request->boolean('barba'),
            'tipo_barba' => $request->input('tipo_barba', null),
            'textura' => $request->input('textura', null),
            'canas' => $request->input('canas', null),
            'injerto_capilar' => $request->boolean('injerto_capilar'),
            'estado' => $request->input('estado', null),
            'deseos' => $request->input('deseos', null),
        ]
    );

    return redirect()->back()->with('success', 'Ficha guardada correctamente.');
}







}

