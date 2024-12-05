<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre', 'descripcion', 'precio', 'stock', 'proveedor_id'
    ];

    public function proveedor()
    {
        return $this->belongsTo(Proveedor::class);
    }

    public function carritos()
    {
        return $this->hasMany(Carrito::class);
    }

    public function pedidosProveedores()
    {
        return $this->hasMany(PedidoProveedor::class);
    }
}
