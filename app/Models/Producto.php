<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre', 'descripcion', 'precio','precio_proveedor', 'stock', 'proveedor_id'
    ];

    public function proveedor()
    {
        return $this->belongsTo(Proveedor::class, 'proveedor_id');
    }

    public function pedidos()
    {
        return $this->belongsToMany(Pedido::class, 'pedido_productos')
            ->withPivot('cantidad', 'precio_unitario')
            ->withTimestamps();
    }

    public function pedidosProveedores()
    {
        return $this->hasMany(PedidoProveedor::class, 'producto_id');
    }
}
