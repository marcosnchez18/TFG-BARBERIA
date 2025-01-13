<?php

namespace App\Http\Controllers;

use App\Models\PedidoProducto;
use App\Models\PedidoProveedor;
use App\Models\Producto;
use Illuminate\Http\JsonResponse;
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
            'precio' => 'required|numeric|min:0',
            'precio_proveedor' => 'required|numeric|min:0', // Nuevo campo
            'stock' => 'required|integer|min:1',
            'proveedor_id' => 'required|exists:proveedores,id',
            'imagen' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        // Crear el nuevo producto
        $producto = new Producto();
        $producto->nombre = $validated['nombre'];
        $producto->descripcion = $validated['descripcion'];
        $producto->precio = $validated['precio'];
        $producto->precio_proveedor = $validated['precio_proveedor']; // Nuevo campo
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


public function obtenerProductos()
{
    $productos = Producto::select('productos.*', 'proveedores.nombre as proveedor_nombre')
        ->join('proveedores', 'productos.proveedor_id', '=', 'proveedores.id')
        ->get();

    return response()->json($productos);
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
    public function destroy($id)
{
    $producto = Producto::findOrFail($id);

    // Verificar si el producto está en un pedido de cliente con estado 'pendiente'
    $pedidoClientePendiente = PedidoProducto::where('producto_id', $id)
        ->whereHas('pedido', function ($query) {
            $query->where('estado', 'pendiente');
        })
        ->exists();

    // Verificar si el producto está en un pedido de proveedor con estado 'pendiente'
    $pedidoProveedorPendiente = PedidoProveedor::where('producto_id', $id)
        ->where('estado', 'pendiente')
        ->exists();

    if ($pedidoClientePendiente) {
        return redirect()
            ->route('admin.productos.editar')
            ->with('message', 'No se puede eliminar el producto porque está en pedidos pendientes de clientes.');
    }

    if ($pedidoProveedorPendiente) {
        return redirect()
            ->route('admin.productos.editar')
            ->with('message', 'No se puede eliminar el producto porque está en pedidos pendientes de proveedores.');
    }

    // Si el producto no está en pedidos pendientes, proceder con la eliminación
    $producto->delete();

    return redirect()
        ->route('admin.productos.editar')
        ->with('message', 'Producto eliminado con éxito.');
}

public function obtenerProductosBajoStock(): JsonResponse
    {
        // Define el umbral de bajo stock
        $umbral = 5;

        // Consulta los productos con stock menor al umbral
        $productos = Producto::where('stock', '<', $umbral)
            ->get(['id', 'nombre', 'stock', 'imagen']); // Asegúrate de que el campo 'imagen' existe en tu modelo

        // Retorna los datos en formato JSON
        return response()->json($productos);
    }




public function updatePhoto(Request $request, $id)
{
    $request->validate([
        'imagen' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    $producto = Producto::findOrFail($id);

    if ($request->hasFile('imagen')) {
            $imagePath = $request->file('imagen')->store('productos', 'public');
            $producto->imagen = $imagePath;
        }

    $producto->save();

    return redirect()->back()->with('success', 'Foto actualizada con éxito.');
}


public function updateField(Request $request, $id)
{
    $request->validate([
        'nombre' => 'nullable|string|max:255',
        'descripcion' => 'nullable|string|max:500',
        'precio' => 'nullable|numeric|min:0',
        'precio_proveedor' => 'nullable|numeric|min:0',
        'stock' => 'nullable|integer|min:0',
        'proveedor_id' => 'nullable|exists:proveedores,id',
    ]);

    $producto = Producto::findOrFail($id);

    if ($request->has('nombre')) {
        $producto->nombre = $request->nombre;
    }

    if ($request->has('descripcion')) {
        $producto->descripcion = $request->descripcion;
    }

    if ($request->has('precio')) {
        $producto->precio = $request->precio;
    }

    if ($request->has('precio_proveedor')) {
        $producto->precio_proveedor = $request->precio_proveedor;
    }

    if ($request->has('stock')) {
        $producto->stock = $request->stock;
    }

    if ($request->has('proveedor_id')) {
        $producto->proveedor_id = $request->proveedor_id;
    }

    $producto->save();

    return redirect()->back()->with('success', 'Producto actualizado con éxito.');
}

}
