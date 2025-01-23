<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;

class CitaCanceladaPorTrabajador extends Mailable
{
    public $usuario;
    public $trabajador;
    public $cita;

    public function __construct($usuario, $trabajador, $cita)
    {
        $this->usuario = $usuario;
        $this->trabajador = $trabajador;
        $this->cita = $cita;
    }

    public function build()
    {
        return $this->subject('Cancelación de cita')
                    ->view('emails.cita_cancelada_trabajador')
                    ->with([
                        'usuario' => $this->usuario,
                        'trabajador' => $this->trabajador,
                        'cita' => $this->cita,
                    ]);
    }
}
