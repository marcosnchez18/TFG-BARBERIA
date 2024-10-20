<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Recompensa extends Model
{
    protected $fillable = [
        'cliente_referente_id',
        'cliente_referido_id',
        'monto_referencia'
    ];

    // Relación con el cliente referente (quien refirió)
    public function referente()
    {
        return $this->belongsTo(User::class, 'cliente_referente_id', 'numero_tarjeta_vip');
    }

    // Relación con el cliente referido (quien fue referido)
    public function referido()
    {
        return $this->belongsTo(User::class, 'cliente_referido_id', 'numero_tarjeta_vip');
    }
}
