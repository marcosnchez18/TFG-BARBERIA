<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'nombre',
        'email',
        'password',
        'rol',
        'saldo',
        'contador_ausencias',
        'estado',
        'numero_tarjeta_vip',
        'referido_por'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // Generar número de tarjeta VIP antes de crear el usuario
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($user) {
            if ($user->rol === 'cliente') { // Solo generar si es cliente
                $user->numero_tarjeta_vip = self::generateNumeroTarjetaVIP();
            }
        });
    }

    // Función para generar número de tarjeta VIP
    public static function generateNumeroTarjetaVIP()
    {
        // Genera un número aleatorio único para la tarjeta VIP, 16 caracteres en hexadecimal
        return strtoupper(bin2hex(random_bytes(8)));
    }

    // Relación con las citas (un usuario tiene muchas citas)
    public function citas()
    {
        return $this->hasMany(Cita::class, 'usuario_id');
    }

    // Relación con las citas como barbero (un barbero tiene muchas citas)
    public function citasBarbero()
    {
        return $this->hasMany(Cita::class, 'barbero_id');
    }

    // Relación con las noticias (un barbero puede escribir muchas noticias)
    public function noticias()
    {
        return $this->hasMany(Noticia::class, 'usuario_id');
    }

    // Relación con las recompensas como cliente referido
    public function recompensasReferido()
    {
        return $this->hasMany(Recompensa::class, 'cliente_referido_id', 'numero_tarjeta_vip');
    }

    // Relación con las recompensas como cliente referente
    public function recompensasReferente()
    {
        return $this->hasMany(Recompensa::class, 'cliente_referente_id', 'numero_tarjeta_vip');
    }
}
