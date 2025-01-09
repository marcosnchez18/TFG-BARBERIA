<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use Illuminate\Http\Request;

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
    $pedido = Pedido::create([
        'user_id' => auth()->id(),
        'estado' => 'pendiente',
        'total' => 0, // Se actualizará más tarde
        'metodo_entrega' => $request->metodo_entrega,
        'direccion_entrega' => $request->metodo_entrega === 'envio' ? $request->direccion : null
    ]);

    return response()->json(['message' => 'Pedido registrado con éxito', 'pedido_id' => $pedido->id]);
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
