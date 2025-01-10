<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    use HasFactory;

    protected $fillable = [
        'pedido_id', 'codigo', 'total', 'fecha'
    ];

    public function pedido()
    {
        return $this->belongsTo(Pedido::class);
    }
}
