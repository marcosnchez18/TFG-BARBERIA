<?php

namespace App\Mail;

use App\Models\Cita;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ConfirmacionCitaMail extends Mailable
{
    use Queueable, SerializesModels;

    public $cita;
    public $user;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($cita, $user)
    {
        $this->cita = $cita;
        $this->user = $user;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Confirmación de tu Cita')
                    ->markdown('emails.confirmacion_cita');
    }
}
