<?php

namespace App\Http\Controllers;

use App\Mail\PedidoRealizadoMail;
use App\Models\Pedido;
use App\Models\PedidoProducto;
use App\Models\PedidoProveedor;
use App\Models\Producto;
use App\Models\Recibo;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class PedidoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user(); // Obtener usuario autenticado

        // Obtener pedidos del usuario autenticado con la relación 'user'
        $pedidos = Pedido::where('user_id', $user->id)
            ->with('user') // Relación con el modelo User
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($pedido) {
                return [
                    'id' => $pedido->id,
                    'email' => $pedido->user->email ?? 'Correo no disponible', // Evita errores si no hay email
                    'estado' => ucfirst($pedido->estado), // Primera letra en mayúscula
                    'total' => number_format($pedido->total, 2) . ' €', // Formato de precio
                    'metodo_entrega' => ucfirst($pedido->metodo_entrega), // Primera letra en mayúscula
                    'direccion_entrega' => $pedido->metodo_entrega === 'envio'
                        ? $pedido->direccion_entrega
                        : 'Recogida en tienda',
                    'fecha_pedido' => $pedido->created_at->format('d/m/Y H:i'), // Formato de fecha
                ];
            });

        return Inertia::render('MisPedidos', [
            'pedidos' => $pedidos
        ]);
    }

    public function getPedidos()
    {
        $user = Auth::user();

        $pedidos = Pedido::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($pedidos);
    }

    public function getPedidosAdmin()
{
    $pedidos = Pedido::with('user:id,email')->get();

    return response()->json($pedidos);
}


public function pedidosAdminVista()
{
    return Inertia::render('PedidosAdmin');
}

public function pedidosTrabVista()
{
    return Inertia::render('PedidosTrabajador');
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
            // Generar un código único de 16 dígitos para el pedido
            do {
                $codigoPedido = str_pad(mt_rand(0, 9999999999999999), 16, '0', STR_PAD_LEFT);
            } while (Pedido::where('codigo_pedido', $codigoPedido)->exists());

            // Calcular el total del pedido sumando los precios de cada producto
            $total = collect($request->productos)->sum(fn($producto) => $producto['precio'] * $producto['cantidad']);

            $direccionRecogida = "C. Cristóbal Colón, 20, 11540 Sanlúcar de Barrameda, Cádiz";


            // Crear el pedido en la base de datos con el total correcto
            $pedido = Pedido::create([
                'user_id' => auth()->id(),
                'estado' => 'pendiente',
                'total' => $total, // Ahora almacena el total real del pedido
                'metodo_entrega' => $request->metodo_entrega,
                'direccion_entrega' => $request->metodo_entrega === 'envio'
                    ? $request->direccion
                    : $direccionRecogida,

                'codigo_pedido' => $codigoPedido, // Usar el código generado
                'reembolso_realizado' => false,
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
                'codigo_pedido' => $pedido->codigo_pedido, // Pasar el código de pedido al correo
                'usuario' => auth()->user(),
                'productos' => $request->productos,
                'total' => $total,
                'metodo_entrega' => $request->metodo_entrega,
                'direccion' => $request->metodo_entrega === 'envio' ? $request->direccion : null
            ]));

            DB::commit(); // Confirmar transacción si todo salió bien

            return response()->json([
                'message' => 'Pedido registrado con éxito',
                'numero_pedido' => $pedido->codigo_pedido, // Devolver el código de pedido único
            ]);
        } catch (\Exception $e) {
            DB::rollBack(); // Si hay un error, deshacer los cambios
            return response()->json(['error' => 'Hubo un problema al registrar el pedido.'], 500);
        }
    }



    /**
     * Display the specified resource.
     */
    public function show($id)
{
    $pedido = Pedido::with('productos')->findOrFail($id);

    return response()->json([
        'codigo_pedido' => $pedido->codigo_pedido,
        'total' => $pedido->total,
        'estado' => $pedido->estado,
        'metodo_entrega' => $pedido->metodo_entrega,
        'direccion_entrega' => $pedido->direccion_entrega,
        'fecha' => $pedido->created_at,
        'productos' => $pedido->productos->map(function ($producto) {
            return [
                'id' => $producto->id,
                'nombre' => $producto->nombre,
                'imagen' => $producto->imagen, // Asegúrate de que este campo existe
                'pivot' => [
                    'cantidad' => $producto->pivot->cantidad,
                    'precio_unitario' => $producto->pivot->precio_unitario,
                ],
            ];
        }),
    ]);
}


public function cancelar($id)
{
    $pedido = Pedido::findOrFail($id);

    // Solo permitir cancelar pedidos con estado pendiente
    if ($pedido->estado !== 'pendiente') {
        return response()->json(['error' => 'Solo se pueden cancelar pedidos pendientes.'], 403);
    }

    // Restaurar el stock de los productos del pedido
    foreach ($pedido->productos as $producto) {
        $producto->increment('stock', $producto->pivot->cantidad);
    }

    // Actualizar estado del pedido
    $pedido->estado = 'cancelado';
    $pedido->save();

    return response()->json(['message' => 'Pedido cancelado correctamente y stock restaurado.'], 200);
}



public function actualizarEstado(Request $request, $id)
{
    $pedido = Pedido::findOrFail($id);

    // Lista de estados permitidos
    $estadosValidos = ['pendiente', 'enviado', 'entregado', 'cancelado'];
    if (!in_array($request->estado, $estadosValidos)) {
        return response()->json(['error' => 'Estado no válido.'], 400);
    }

    // Si el pedido pasa a "cancelado", restaurar el stock de los productos
    if ($pedido->estado !== 'cancelado' && $request->estado === 'cancelado') {
        foreach ($pedido->productos as $producto) {
            $producto->increment('stock', $producto->pivot->cantidad);
        }
    }

    // Actualizar solo el estado del pedido
    $pedido->estado = $request->estado;
    $pedido->save();

    return response()->json(['message' => 'Estado actualizado correctamente.'], 200);
}


public function emitirReembolso($id)
{
    $pedido = Pedido::findOrFail($id);

    // Verificar que el pedido está cancelado
    if ($pedido->estado !== 'cancelado') {
        return response()->json(['error' => 'Solo se pueden reembolsar pedidos cancelados.'], 403);
    }

    // Verificar si ya ha sido reembolsado
    if ($pedido->reembolso_realizado) {
        return response()->json(['error' => 'El pedido ya ha sido reembolsado.'], 400);
    }

    // Obtener usuario asociado
    $usuario = User::find($pedido->user_id);
    if (!$usuario) {
        return response()->json(['error' => 'Usuario no encontrado.'], 404);
    }

    // Reembolsar el saldo al usuario
    $usuario->saldo += $pedido->total;
    $usuario->save();

    // Marcar el pedido como reembolsado
    $pedido->reembolso_realizado = true;
    $pedido->save();

    return response()->json(['message' => 'Reembolso emitido correctamente.'], 200);
}


public function realizarPedido(Request $request)
{
    $request->validate([
        'productos' => 'required|array',
        'productos.*.producto_id' => 'exists:productos,id',
        'productos.*.cantidad' => 'integer|min:1'
    ]);

    // Generar un código único para el pedido
    do {
        $codigoPedido = str_pad(mt_rand(0, 9999999999999999), 16, '0', STR_PAD_LEFT);
    } while (PedidoProveedor::where('codigo_pedido', $codigoPedido)->exists());

    foreach ($request->productos as $item) {
        $producto = Producto::findOrFail($item['producto_id']);

        // Verificar que el producto tiene precio de proveedor
        if (!$producto->precio_proveedor) {
            return response()->json(['error' => 'El producto ' . $producto->nombre . ' no tiene un precio de proveedor asignado.'], 400);
        }

        PedidoProveedor::create([
            'codigo_pedido' => $codigoPedido, // Asignamos el mismo código a todos los productos del pedido
            'proveedor_id' => $producto->proveedor_id,
            'producto_id' => $producto->id,
            'cantidad' => $item['cantidad'],
            'total' => $producto->precio_proveedor * $item['cantidad']
        ]);
    }

    return response()->json(['message' => 'Pedido realizado correctamente.', 'codigo_pedido' => $codigoPedido], 201);
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
