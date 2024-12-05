<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PedidoProveedor extends Model
{
    use HasFactory;

    protected $fillable = [
        'proveedor_id', 'producto_id', 'cantidad', 'estado', 'total'
    ];

    protected $table = 'pedidos_proveedores';

    public function proveedor()
    {
        return $this->belongsTo(Proveedor::class);
    }

    public function producto()
    {
        return $this->belongsTo(Producto::class);
    }

    public function pedido()
    {
        return $this->belongsTo(Pedido::class);
    }
}
