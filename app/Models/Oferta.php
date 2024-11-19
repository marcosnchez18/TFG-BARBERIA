<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Oferta extends Model
{
    use HasFactory;

    protected $table = 'ofertas'; // Nombre de la tabla
    protected $fillable = [
        'nombre',
        'descripcion',
        'duracion_meses',
        'numero_vacantes',
        'inscripciones_maximas',
    ];

    /**
     * Relación: Una oferta tiene muchas candidaturas.
     */
    public function candidaturas()
    {
        return $this->hasMany(Candidatura::class, 'oferta_id');
    }
}
