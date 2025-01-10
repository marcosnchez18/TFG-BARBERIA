<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CancelacionCitaCliente extends Mailable
{
    use Queueable, SerializesModels;

    public $cita;

    /**
     * Create a new message instance.
     */
    public function __construct($cita)
    {
        $this->cita = $cita;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('Cancelación de tu cita en la barbería')
            ->view('emails.cancelacion_cita_cliente')
            ->with([
                'nombreCliente' => $this->cita->usuario->nombre,
                'fechaCita' => $this->cita->fecha_hora_cita,
                'metodoPago' => $this->cita->metodo_pago,
            ]);
    }
}
