<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;

class ProductoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    try {
        // Validar los datos
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'precio' => 'required|numeric',
            'stock' => 'required|integer|min:1',
            'proveedor_id' => 'required|exists:proveedores,id',
            'imagen' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        // Crear el nuevo producto
        $producto = new Producto();
        $producto->nombre = $validated['nombre'];
        $producto->descripcion = $validated['descripcion'];
        $producto->precio = $validated['precio'];
        $producto->stock = $validated['stock'];
        $producto->proveedor_id = $validated['proveedor_id'];

        // Subir la imagen si existe
        if ($request->hasFile('imagen')) {
            $imagePath = $request->file('imagen')->store('productos', 'public');
            $producto->imagen = $imagePath;
        }

        // Guardar el producto en la base de datos
        $producto->save();

        // Responder con el mensaje de éxito
        return redirect()->route('productos.index')->with('success', 'Producto registrado exitosamente.');

    } catch (\Exception $e) {
        // Si ocurre un error, devolver un mensaje genérico
        return back()->with('error', 'Ocurrió un error en el servidor.');
    }
}



    /**
     * Display the specified resource.
     */
    public function show(Producto $producto)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Producto $producto)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Producto $producto)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Producto $producto)
    {
        //
    }
}
