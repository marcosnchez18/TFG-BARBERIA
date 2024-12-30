<?php

namespace App\Http\Controllers;

use App\Models\Servicio;
use Illuminate\Support\Facades\File;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServicioController extends Controller
{
    /**
     * Muestra el formulario para crear un nuevo servicio.
     */

     public function index()
    {
        $servicios = Servicio::all(); // Obtiene todos los servicios de la base de datos
        return response()->json($servicios); // Devuelve los datos en formato JSON
    }


    public function create()
    {
        return Inertia::render('NuevosServicios');
    }

    public function createTrab()
    {
        return Inertia::render('NuevosServiciosTrab');
    }

    /**
     * Guarda un nuevo servicio en la base de datos y actualiza el archivo JSON.
     */
    public function store(Request $request)
{
    $validated = $request->validate([
        'nombre' => 'required|string|max:255',
        'descripcion' => 'nullable|string',
        'precio' => 'required|numeric|min:0',
        'duracion' => 'required|integer|min:1',
        'barbero' => 'required|exists:users,id' // Validar que el ID del barbero exista
    ]);

    $servicio = Servicio::create($validated);

    // Relación con la tabla pivote
    $servicio->barberos()->attach($validated['barbero']);

    $this->actualizarServiciosJson();

    return redirect()->route('admin.servicios.create')->with('success', 'Servicio creado correctamente.');
}


public function storeTrab(Request $request)
{
    $validated = $request->validate([
        'nombre' => 'required|string|max:255',
        'descripcion' => 'nullable|string',
        'precio' => 'required|numeric|min:0',
        'duracion' => 'required|integer|min:1',
        'barbero' => 'required|exists:users,id' // Validar que el ID del barbero exista
    ]);

    $servicio = Servicio::create($validated);

    // Relación con la tabla pivote
    $servicio->barberos()->attach($validated['barbero']);

    $this->actualizarServiciosJson();

    return redirect()->route('trabajador.servicios.create')->with('success', 'Servicio creado correctamente.');
}
    /**
     * Actualiza el archivo JSON con los servicios actuales de la base de datos.
     */
    protected function actualizarServiciosJson()
    {

        $servicios = Servicio::select('id', 'nombre', 'precio', 'descripcion', 'duracion')->get();


        $jsonData = json_encode($servicios, JSON_PRETTY_PRINT);


        File::put(public_path('data/servicios.json'), $jsonData);
    }



    public function edit()
    {
        $servicios = Servicio::all();

        return Inertia::render('EditarServicios', [
            'servicios' => $servicios,
        ]);
    }

    public function destroy($id)
    {

        $servicio = Servicio::findOrFail($id);
        $servicio->delete();


        $this->actualizarServiciosJson();


        return redirect()->route('admin.servicios.editar')->with('success', 'Servicio eliminado correctamente.');
    }



    public function update(Request $request, $id)
    {

        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'precio' => 'required|numeric|min:0',
            'duracion' => 'required|integer|min:1',
        ]);


        $servicio = Servicio::findOrFail($id);
        $servicio->update($validated);


        $this->actualizarServiciosJson();


        return redirect()->route('admin.servicios.editar')->with('success', 'Servicio actualizado correctamente.');
    }
}
