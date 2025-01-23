<?php

namespace App\Http\Controllers;

use App\Models\Oferta;
use Illuminate\Http\Request;

class OfertaController extends Controller
{
    /**
     * Muestra una lista de ofertas.
     */
    public function index()
{
    $ofertas = Oferta::orderBy('created_at', 'desc')->get(); // Obtener todas las ofertas ordenadas
    return inertia('Empleo', ['ofertas' => $ofertas]); // Pasarlas al componente
}


    /**
     * Almacena una nueva oferta en la base de datos.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'duracion_meses' => 'required|integer|min:1',
            'numero_vacantes' => 'required|integer|min:1',

        ]);

        Oferta::create($request->all());

        return redirect()->route('ofertas.index')->with('success', 'Oferta publicada con éxito.');
    }

    /**
     * Muestra una oferta específica.
     */
    public function show(Oferta $oferta)
    {
        return inertia('OfertaDetalle', ['oferta' => $oferta]); // Renderiza la oferta en detalle
    }

    /**
     * Actualiza una oferta existente.
     */
    public function update(Request $request, Oferta $oferta)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'duracion_meses' => 'required|integer|min:1',
            'numero_vacantes' => 'required|integer|min:1',
        ]);

        $oferta->update($request->all());

        return redirect()->route('ofertas.index')->with('success', 'Oferta actualizada con éxito.');
    }

    /**
     * Elimina una oferta.
     */
    public function destroy(Oferta $oferta)
    {
        $oferta->delete();

        return redirect()->route('ofertas.index')->with('success', 'Oferta eliminada con éxito.');
    }

    public function trabaja()
{
    $ofertas = Oferta::orderBy('created_at', 'desc')->get();
    return inertia('TrabajaNosotros', ['ofertas' => $ofertas]);
}


public function inscribirse($id)
{
    $oferta = Oferta::findOrFail($id);
    return inertia('Inscripciones', ['oferta' => $oferta]);
}


public function trabaja2()
{
    $ofertas = Oferta::orderBy('created_at', 'desc')->get();
    return inertia('Cliente/TrabajaCliente', ['ofertas' => $ofertas]);
}

public function inscribirse2($id)
{
    $oferta = Oferta::findOrFail($id);
    return inertia('Cliente/InscripcionesClientes', ['oferta' => $oferta]);
}

}
