<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    use HasFactory;

    protected $fillable = ['pedido_id', 'codigo', 'total', 'fecha'];


    protected static function booted()
    {
        static::creating(function ($ticket) {
            if (empty($ticket->codigo)) {
                $ticket->codigo = str_pad(rand(0, 99999999999), 11, '0', STR_PAD_LEFT);  
            }
        });
    }
}
