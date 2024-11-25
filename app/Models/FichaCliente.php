<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FichaCliente extends Model
{
    use HasFactory;

    protected $table = 'fichas_clientes';

    protected $fillable = [
        'user_id',
        'color',
        'tinte',
        'colores_usados',
        'tipo_pelo',
        'tipo_rostro',
        'tipo_corte',
        'barba',
        'tipo_barba',
        'textura',
        'canas',
        'injerto_capilar',
        'estado',
        'deseos',
    ];

    protected $casts = [
        'tinte' => 'boolean',
        'barba' => 'boolean',
        'injerto_capilar' => 'boolean',
        'colores_usados' => 'array',
    ];

    // Relación con el modelo User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
