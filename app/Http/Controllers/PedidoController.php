<?php

namespace App\Http\Controllers;

use App\Mail\PedidoRealizadoMail;
use App\Models\Pedido;
use App\Models\PedidoProducto;
use App\Models\Producto;
use App\Models\Recibo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class PedidoController extends Controller
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
    DB::beginTransaction(); // Iniciar transacción para evitar datos inconsistentes

    try {
        // Calcular el total del pedido sumando los precios de cada producto
        $total = collect($request->productos)->sum(fn($producto) => $producto['precio'] * $producto['cantidad']);

        // Crear el pedido en la base de datos con el total correcto
        $pedido = Pedido::create([
            'user_id' => auth()->id(),
            'estado' => 'pendiente',
            'total' => $total, // Ahora almacena el total real del pedido
            'metodo_entrega' => $request->metodo_entrega,
            'direccion_entrega' => $request->metodo_entrega === 'envio' ? $request->direccion : null
        ]);

        // Insertar cada producto en la tabla `pedido_productos`
        foreach ($request->productos as $producto) {
            // Obtener el producto de la base de datos
            $productoDB = Producto::find($producto['id']);

            if (!$productoDB || $productoDB->stock < $producto['cantidad']) {
                DB::rollBack(); // Si no hay suficiente stock, se cancela la operación
                return response()->json(['error' => "Stock insuficiente para {$productoDB->nombre}"], 400);
            }

            // Insertar el producto en la tabla de relación
            PedidoProducto::create([
                'pedido_id' => $pedido->id,
                'producto_id' => $producto['id'],
                'cantidad' => $producto['cantidad'],
                'precio_unitario' => $producto['precio']
            ]);

            // Reducir el stock del producto
            $productoDB->decrement('stock', $producto['cantidad']);
        }

        // Generar el recibo del pedido
        Recibo::create([
            'pedido_id' => $pedido->id,
            'total' => $total,
            'fecha_generacion' => now()
        ]);

        // Enviar el correo al usuario con los detalles del pedido
        Mail::to(auth()->user()->email)->send(new PedidoRealizadoMail([
            'id' => $pedido->id,
            'usuario' => auth()->user(),
            'productos' => $request->productos,
            'total' => $total,
            'metodo_entrega' => $request->metodo_entrega,
            'direccion' => $request->metodo_entrega === 'envio' ? $request->direccion : null
        ]));

        DB::commit(); // Confirmar transacción si todo salió bien

        return response()->json(['message' => 'Pedido registrado con éxito', 'pedido_id' => $pedido->id]);

    } catch (\Exception $e) {
        DB::rollBack(); // Si hay un error, deshacer los cambios
        return response()->json(['error' => 'Hubo un problema al registrar el pedido.'], 500);
    }
}

    /**
     * Display the specified resource.
     */
    public function show(Pedido $pedido)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Pedido $pedido)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Pedido $pedido)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pedido $pedido)
    {
        //
    }
}
