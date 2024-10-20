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
        'valoracion'
    ];

    // Relación con el cliente que agenda la cita
    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    // Relación con el barbero que atiende la cita
    public function barbero()
    {
        return $this->belongsTo(User::class, 'barbero_id');
    }

    // Relación con el servicio
    public function servicio()
    {
        return $this->belongsTo(Servicio::class, 'servicio_id');
    }
}
