<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Noticia extends Model
{
    protected $fillable = [
        'usuario_id',
        'titulo',
        'contenido'
    ];


    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }
}
