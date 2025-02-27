<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PedidoProveedor extends Model
{
    use HasFactory;

    protected $fillable = [
        'proveedor_id', 'producto_id', 'cantidad', 'estado', 'total', 'codigo_pedido'
    ];

    protected $table = 'pedidos_proveedores';

    public function proveedor()
    {
        return $this->belongsTo(Proveedor::class, 'proveedor_id');
    }

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'producto_id');
    }


}
