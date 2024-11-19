<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Candidatura extends Model
{
    use HasFactory;

    protected $table = 'candidaturas'; // Nombre de la tabla
    protected $fillable = [
        'localizador',
        'nombre',
        'email',
        'cv',
        'es_cliente',
        'user_id',
        'oferta_id',
    ];

    /**
     * Relación: Una candidatura pertenece a una oferta.
     */
    public function oferta()
    {
        return $this->belongsTo(Oferta::class, 'oferta_id');
    }

    /**
     * Relación: Una candidatura puede estar asociada a un cliente (usuario).
     */
    public function usuario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
