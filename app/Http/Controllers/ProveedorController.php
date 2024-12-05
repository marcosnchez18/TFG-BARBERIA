<?php

namespace App\Http\Controllers;

use App\Models\Proveedor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class ProveedorController extends Controller
{
    /**
     * Función para almacenar un nuevo proveedor.
     */
    public function store(Request $request)
{
    try {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'contacto' => 'required|string|max:255',
            'telefono' => 'required|string|max:20',
            'email' => 'required|email|unique:proveedores,email',
            'direccion' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $proveedor = Proveedor::create([
            'nombre' => $request->nombre,
            'contacto' => $request->contacto,
            'telefono' => $request->telefono,
            'email' => $request->email,
            'direccion' => $request->direccion,
        ]);

        return response()->json([
            'message' => 'Proveedor registrado exitosamente.',
            'proveedor' => $proveedor
        ], 201);

    } catch (\Exception $e) {
        return response()->json(['message' => 'Ocurrió un error en el servidor.'], 500);
    }
}



public function destroy($id)
{
    $proveedor = Proveedor::findOrFail($id);


    $proveedor->delete();


    return redirect()
        ->route('admin.proveedores.editar')
        ->with('message', 'Proveedor eliminado con éxito.');
}






    public function editarProveedores()
    {

        $proveedores = Proveedor::all();

        // Pasar los datos a la vista
        return inertia('EditarProveedores', ['proveedores' => $proveedores]);
    }

    public function updateField(Request $request, $id)
    {
        // Validar los campos enviados por el formulario
        $request->validate([
            'nombre' => 'nullable|string|max:255',
            'contacto' => 'nullable|string|max:255',
            'telefono' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255|unique:proveedores,email,' . $id,
            'direccion' => 'nullable|string|max:500',
        ]);

        // Buscar el proveedor por ID
        $proveedor = Proveedor::findOrFail($id);

        // Actualizar los campos si han sido enviados
        if ($request->has('nombre')) {
            $proveedor->nombre = $request->nombre;
        }

        if ($request->has('contacto')) {
            $proveedor->contacto = $request->contacto;
        }

        if ($request->has('telefono')) {
            $proveedor->telefono = $request->telefono;
        }

        if ($request->has('email')) {
            $proveedor->email = $request->email;
        }

        if ($request->has('direccion')) {
            $proveedor->direccion = $request->direccion;
        }

        // Guardar los cambios
        $proveedor->save();

        // Redirigir de vuelta con un mensaje de éxito
        return redirect()->back()->with('success', 'Proveedor actualizado con éxito.');
    }

}
