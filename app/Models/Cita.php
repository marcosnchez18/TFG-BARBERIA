<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cita extends Model
{
    protected $fillable = [
        'usuario_id',
        'barbero_id',
        'servicio_id',
        'estado',
        'fecha_hora_cita',
        'valoracion',
        'metodo_pago',
        'descuento_aplicado',
        'precio_cita'
    ];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    public function barbero()
    {
        return $this->belongsTo(User::class, 'barbero_id');
    }

    public function servicio()
    {
        return $this->belongsTo(Servicio::class, 'servicio_id');
    }
}
