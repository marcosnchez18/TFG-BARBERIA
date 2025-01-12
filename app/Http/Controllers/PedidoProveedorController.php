<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PedidoProveedor;
use App\Models\Producto;

class PedidoProveedorController extends Controller
{
    public function index()
    {
        $pedidos = PedidoProveedor::with(['producto', 'proveedor'])->get();

        return response()->json($pedidos);
    }

    public function actualizarEstado(Request $request, $codigo_pedido)
{
    // Validar el estado recibido en la petición
    $request->validate([
        'estado' => 'required|in:pendiente,enviado,entregado,cancelado'
    ]);

    // Actualizar todos los pedidos con el mismo código de pedido
    PedidoProveedor::where('codigo_pedido', $codigo_pedido)
        ->update(['estado' => $request->estado]);

    return response()->json(['message' => 'Estado actualizado con éxito.']);
}


public function añadirStock($codigo_pedido)
{
    // Obtener todos los pedidos con el mismo código
    $pedidos = PedidoProveedor::where('codigo_pedido', $codigo_pedido)
        ->where('stock_añadido', false) // Solo procesar los que aún no han añadido stock
        ->get();

    if ($pedidos->isEmpty()) {
        return response()->json(['message' => 'El stock ya ha sido añadido previamente.'], 400);
    }

    foreach ($pedidos as $pedido) {
        // Buscar el producto correspondiente
        $producto = Producto::find($pedido->producto_id);

        if ($producto) {
            // Sumar la cantidad del pedido al stock del producto
            $producto->stock += $pedido->cantidad;
            $producto->save();

            // Marcar el pedido como "stock añadido"
            $pedido->stock_añadido = true;
            $pedido->save();
        }
    }

    return response()->json([
        'message' => 'Stock añadido correctamente.',
        'codigo_pedido' => $codigo_pedido
    ]);
}




}

