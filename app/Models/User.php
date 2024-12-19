<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Contracts\Auth\MustVerifyEmail;  // Importar MustVerifyEmail para la verificación de email
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable implements MustVerifyEmail  // Implementar MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Los atributos que se pueden asignar en masa.
     *
     * @var array
     */
    protected $fillable = [
        'nombre',
        'email',
        'password',
        'rol',
        'saldo',
        'estado',
        'numero_tarjeta_vip',
        'referido_por',
        'imagen',
    ];

    /**
     * Los atributos que deben permanecer ocultos.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Boot method para ejecutar acciones antes de que un usuario sea creado.
     */
    protected static function boot()
{
    parent::boot();

    
    static::creating(function ($user) {
        if (in_array($user->rol, ['cliente', 'trabajador'])) {
            $user->numero_tarjeta_vip = self::generateNumeroTarjetaVIP();
        }
    });
}


    /**
     * Generar un número de tarjeta VIP único.
     *
     * @return string
     */
    public static function generateNumeroTarjetaVIP()
    {
        // Generar un número de tarjeta VIP único con 16 caracteres
        return strtoupper(bin2hex(random_bytes(8)));
    }


    public function citas()
    {
        return $this->hasMany(Cita::class, 'usuario_id');
    }


    public function citasBarbero()
    {
        return $this->hasMany(Cita::class, 'barbero_id');
    }


    public function noticias()
    {
        return $this->hasMany(Noticia::class, 'usuario_id');
    }

    /**
     * Relación con las recompensas como cliente referido: un cliente puede recibir recompensas por ser referido.
     */
    public function recompensasReferido()
    {
        return $this->hasMany(Recompensa::class, 'cliente_referido_id', 'numero_tarjeta_vip');
    }

    /**
     * Relación con las recompensas como cliente referente: un cliente puede recibir recompensas por referir a otros clientes.
     */
    public function recompensasReferente()
    {
        return $this->hasMany(Recompensa::class, 'cliente_referente_id', 'numero_tarjeta_vip');
    }

    public function candidaturas()
    {
        return $this->hasMany(Candidatura::class, 'user_id');
    }

    public function servicios()
{
    return $this->belongsToMany(Servicio::class, 'servicio_usuario', 'usuario_id', 'servicio_id');
}

public function ficha()
{
    return $this->hasOne(Ficha::class, 'user_id');
}

public function carritos()
    {
        return $this->hasMany(Carrito::class);
    }

    public function pedidos()
    {
        return $this->hasMany(Pedido::class);
    }


public function obtenerCitasCompletadas()
{
    return $this->hasMany(Cita::class, 'usuario_id')->where('estado', 'completada');
}


public function obtenerCitasAusentes()
{
    return $this->hasMany(Cita::class, 'usuario_id')->where('estado', 'ausente');
}

public function obtenerFechasCitasAusentes()
{
    return $this->hasMany(Cita::class, 'usuario_id')
        ->where('estado', 'ausente')
        ->get()
        ->map(function ($cita) {
            return Carbon::parse($cita->fecha_hora_cita)->format('Y-m-d');
        });
}

}
