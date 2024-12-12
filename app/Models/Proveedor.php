<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Proveedor extends Model
{
    use HasFactory;

    protected $table = 'proveedores';

    protected $fillable = [
        'nombre', 'contacto', 'telefono', 'email', 'direccion', 'cif', 'nif'
    ];

    public function productos()
    {
        return $this->hasMany(Producto::class);
    }

    public function pedidosProveedores()
    {
        return $this->hasMany(PedidoProveedor::class);
    }
}
