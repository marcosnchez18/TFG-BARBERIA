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
}
