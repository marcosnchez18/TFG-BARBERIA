<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CancelacionCitaMail extends Mailable
{
    use Queueable, SerializesModels;

    public $usuario;
    public $fechaHoraCita;
    public $servicio;
    public $barbero;
    public $mensajeExplicacion;

    public function __construct($usuario, $fechaHoraCita, $servicio, $barbero, $mensajeExplicacion)
    {
        $this->usuario = $usuario;
        $this->fechaHoraCita = $fechaHoraCita;
        $this->servicio = $servicio;
        $this->barbero = $barbero;
        $this->mensajeExplicacion = $mensajeExplicacion;
    }

    public function build()
    {
        return $this->view('emails.cancelacion_cita')
                    ->subject('Notificación de Cancelación de Cita')
                    ->with([
                        'usuario' => $this->usuario,
                        'fechaHoraCita' => $this->fechaHoraCita,
                        'servicio' => $this->servicio,
                        'barbero' => $this->barbero,
                        'mensajeExplicacion' => $this->mensajeExplicacion,
                    ]);
    }
}
