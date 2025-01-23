<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;

class ClienteDeshabilitado extends Mailable
{
    public $cliente;

    public function __construct($cliente)
    {
        $this->cliente = $cliente;
    }

    public function build()
    {
        return $this->subject('Tu cuenta ha sido deshabilitada')
                    ->view('emails.cliente_deshabilitado')
                    ->with([
                        'cliente' => $this->cliente,
                        'contactoUrl' => url('/contacto'), // URL para el botón
                    ]);
    }
}
