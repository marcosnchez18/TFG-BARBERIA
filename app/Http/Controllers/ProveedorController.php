<?php

namespace App\Http\Controllers;

use App\Models\PedidoProveedor;
use App\Models\Producto;
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
            'cif' => ['nullable', 'string', 'max:9', function ($attribute, $value, $fail) {
                if ($value && !$this->validateCIF($value)) {
                    $fail('El CIF introducido no es válido.');
                }
            }],
            'nif' => ['nullable', 'string', 'max:9', function ($attribute, $value, $fail) {
                if ($value && !$this->validateNIF($value)) {
                    $fail('El NIF introducido no es válido.');
                }
            }],
        ]);

        // Asegurar que al menos uno de los dos (CIF o NIF) sea obligatorio
        if (!$request->cif && !$request->nif) {
            $validator->errors()->add('cif_nif', 'Debe proporcionar al menos un CIF o un NIF válido.');
        }

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
            'cif' => $request->cif,
            'nif' => $request->nif,
        ]);

        return response()->json([
            'message' => 'Proveedor registrado exitosamente.',
            'proveedor' => $proveedor
        ], 201);

    } catch (\Exception $e) {
        return response()->json(['message' => 'Ocurrió un error en el servidor.'], 500);
    }
}

// Validación de NIF (DNI español con letra correcta)
private function validateNIF($nif)
{
    if (!preg_match('/^\d{8}[A-Z]$/', $nif)) {
        return false;
    }

    $letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
    $numero = substr($nif, 0, 8);
    $letraCalculada = $letras[$numero % 23];

    return $letraCalculada === substr($nif, -1);
}

// Validación de CIF (Identificación fiscal de empresas en España)
private function validateCIF($cif)
{
    if (!preg_match('/^[ABCDEFGHJKLMNPQRSUVW]\d{7}[A-J0-9]$/', $cif)) {
        return false;
    }

    $letras = 'JABCDEFGHI';
    $letra = $cif[0];
    $numeros = substr($cif, 1, 7);
    $control = substr($cif, -1);

    $sumaPar = 0;
    $sumaImpar = 0;

    for ($i = 0; $i < 7; $i++) {
        $digito = (int)$numeros[$i];
        if ($i % 2 === 0) { // Posiciones impares (pares en índice)
            $doble = $digito * 2;
            $sumaImpar += floor($doble / 10) + ($doble % 10);
        } else {
            $sumaPar += $digito;
        }
    }

    $sumaTotal = $sumaPar + $sumaImpar;
    $digitoControl = (10 - ($sumaTotal % 10)) % 10;

    if (ctype_alpha($control)) {
        return $letras[$digitoControl] === $control;
    } else {
        return (string)$digitoControl === $control;
    }
}





public function destroy($id)
{
    $proveedor = Proveedor::findOrFail($id);

    // Verificar si hay referencias en otras tablas
    $existePedidoProveedor = PedidoProveedor::where('proveedor_id', $id)->exists();
    $existeProducto = Producto::where('proveedor_id', $id)->exists();

    if ($existePedidoProveedor || $existeProducto) {
        // Usamos la misma clave `message` pero con un mensaje de error
        return redirect()
            ->route('admin.proveedores.editar')
            ->with('message', 'ERROR: No se puede eliminar el proveedor porque tiene pedidos o productos asociados.');
    }

    // Si no está referenciado, se elimina
    $proveedor->delete();

    return redirect()
        ->route('admin.proveedores.editar')
        ->with('message', 'Proveedor eliminado con éxito.');
}




public function obtenerProveedores()
{

    $proveedores = Proveedor::all();

    return response()->json($proveedores);
}





    public function editarProveedores()
    {

        $proveedores = Proveedor::all();

        // Pasar los datos a la vista
        return inertia('Admin/EditarProveedores', ['proveedores' => $proveedores]);
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
        'nif' => [
            'nullable',
            'regex:/^\d{8}[A-Z]$/',
            function ($attribute, $value, $fail) {
                $letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
                $numero = substr($value, 0, -1);
                $letra = substr($value, -1);
                if (strlen($numero) !== 8 || !is_numeric($numero) || $letras[$numero % 23] !== $letra) {
                    $fail('El NIF introducido no es válido.');
                }
            },
        ],
        'cif' => [
            'nullable',
            'regex:/^[ABCDEFGHJKLMNPQRSUVW]\d{7}[A-J0-9]$/',
            function ($attribute, $value, $fail) {
                $letras = 'JABCDEFGHI';
                $letra = $value[0];
                $numeros = substr($value, 1, 7);
                $control = substr($value, -1);

                $sumaPar = 0;
                $sumaImpar = 0;

                for ($i = 0; $i < strlen($numeros); $i++) {
                    $digito = (int)$numeros[$i];
                    if ($i % 2 === 0) {
                        $doble = $digito * 2;
                        $sumaImpar += floor($doble / 10) + ($doble % 10);
                    } else {
                        $sumaPar += $digito;
                    }
                }

                $sumaTotal = $sumaPar + $sumaImpar;
                $digitoControl = (10 - ($sumaTotal % 10)) % 10;

                if (ctype_alpha($control)) {
                    if ($letras[$digitoControl] !== $control) {
                        $fail('El CIF introducido no es válido.');
                    }
                } elseif ($digitoControl != $control) {
                    $fail('El CIF introducido no es válido.');
                }
            },
        ],
    ]);

    // Buscar el proveedor por ID
    $proveedor = Proveedor::findOrFail($id);

    // Actualizar los campos dinámicamente
    foreach ($request->all() as $key => $value) {
        if ($value !== null && in_array($key, ['nombre', 'contacto', 'telefono', 'email', 'direccion', 'nif', 'cif'])) {
            $proveedor->$key = $value;
        }
    }

    // Guardar los cambios
    $proveedor->save();

    // Redirigir con un mensaje de éxito
    return redirect()->back()->with('success', 'Proveedor actualizado con éxito.');
}



}
