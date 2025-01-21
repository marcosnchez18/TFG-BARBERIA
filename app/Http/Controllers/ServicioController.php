<?php

namespace App\Http\Controllers;

use App\Models\Cita;
use App\Models\Servicio;
use App\Models\User;
use Illuminate\Support\Facades\File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use App\Mail\CitaCanceladaPorServicio;

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
        return Inertia::render('NuevosServiciosTrab', [
            'auth' => ['user' => Auth::user()]
        ]);
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
        // Obtener el servicio y verificar su existencia
        $servicio = Servicio::findOrFail($id);

        // Obtener las citas futuras asociadas a este servicio (con fecha posterior al momento actual)
        $citasFuturas = Cita::where('servicio_id', $id)
            ->where('fecha_hora_cita', '>', now())
            ->get();

        // Verificar si hay citas futuras
        if ($citasFuturas->isNotEmpty()) {
            // Procesar cada cita futura
            foreach ($citasFuturas as $cita) {

                // Localizar al usuario asociado a la cita
                $usuario = User::find($cita->usuario_id);

                if ($usuario) {
                    // Si el método de pago fue "adelantado", reembolsar la cantidad al saldo del cliente
                    if ($cita->metodo_pago === 'adelantado') {
                        // Ajustar saldo del usuario sumando el precio de la cita (si está definido)
                        $usuario->saldo += $cita->precio_cita ?? 0;
                        $usuario->save();
                    }

                    // Enviar un correo electrónico avisando de la cancelación de la cita
                    Mail::to($usuario->email)->send(new CitaCanceladaPorServicio($usuario, $servicio, $cita));
                }
            }

            // Cancelar (eliminar) todas las citas futuras de este servicio
            Cita::where('servicio_id', $id)
                ->where('fecha_hora_cita', '>', now())
                ->delete();
        }

        // Eliminar el servicio
        $servicio->delete();

        // Actualizar la información de servicios en JSON (si este método lo gestiona)
        $this->actualizarServiciosJson();

        // Redireccionar con mensaje de éxito
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
