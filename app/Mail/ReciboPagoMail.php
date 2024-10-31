<?php
// app/Mail/ReciboPagoMail.php

namespace App\Mail;

use App\Models\Cita;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ReciboPagoMail extends Mailable
{
    use Queueable, SerializesModels;

    public $cita;

    /**
     * Create a new message instance.
     */
    public function __construct(Cita $cita)
    {
        $this->cita = $cita;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->view('emails.recibo_pago')
                    ->subject('Recibo de Pago - Cita Confirmada')
                    ->with(['cita' => $this->cita]);
    }
}
