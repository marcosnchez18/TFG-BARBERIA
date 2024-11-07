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
    public function create()
    {
        return Inertia::render('NuevosServicios');
    }

    /**
     * Guarda un nuevo servicio en la base de datos y actualiza el archivo JSON.
     */
    public function store(Request $request)
    {
        // Validación de los datos recibidos
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'precio' => 'required|numeric|min:0',
            'duracion' => 'required|integer|min:1',
        ]);

        // Crear el nuevo servicio en la base de datos
        Servicio::create($validated);

        // Actualizar el archivo JSON con los servicios actuales
        $this->actualizarServiciosJson();

        // Redirigir con un mensaje de éxito
        return redirect()->route('admin.servicios.create')->with('success', 'Servicio creado correctamente.');
    }

    /**
     * Actualiza el archivo JSON con los servicios actuales de la base de datos.
     */
    protected function actualizarServiciosJson()
{
    // Obtener todos los servicios con los campos necesarios
    $servicios = Servicio::select('id', 'nombre', 'precio', 'descripcion', 'duracion')->get();

    // Convertir los servicios a JSON
    $jsonData = json_encode($servicios, JSON_PRETTY_PRINT);

    // Guardar el JSON en public/data/servicios.json
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
    // Eliminar el servicio de la base de datos
    $servicio = Servicio::findOrFail($id);
    $servicio->delete();

    // Actualizar el archivo JSON después de eliminar
    $this->actualizarServiciosJson();

    // Redirigir con un mensaje de éxito
    return redirect()->route('admin.servicios.editar')->with('success', 'Servicio eliminado correctamente.');
}



public function update(Request $request, $id)
{
    // Validar los datos
    $validated = $request->validate([
        'nombre' => 'required|string|max:255',
        'descripcion' => 'nullable|string',
        'precio' => 'required|numeric|min:0',
        'duracion' => 'required|integer|min:1',
    ]);

    // Encontrar y actualizar el servicio en la base de datos
    $servicio = Servicio::findOrFail($id);
    $servicio->update($validated);

    // Actualizar el archivo JSON después de editar
    $this->actualizarServiciosJson();

    // Redirigir con un mensaje de éxito
    return redirect()->route('admin.servicios.editar')->with('success', 'Servicio actualizado correctamente.');
}

}
