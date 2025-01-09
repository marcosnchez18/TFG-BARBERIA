<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'estado', 'total', 'metodo_entrega', 'direccion_entrega'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }


    public function productos()
    {
        return $this->belongsToMany(Producto::class, 'pedido_productos')
            ->withPivot('cantidad', 'precio_unitario')
            ->withTimestamps();
    }

    public function recibo()
    {
        return $this->hasOne(Recibo::class, 'pedido_id');
    }

}
