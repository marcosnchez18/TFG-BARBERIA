<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CandidaturaRegistradaMail extends Mailable
{
    use Queueable, SerializesModels;

    public $nombre;
    public $localizador;

    /**
     * Crear una nueva instancia.
     *
     * @param string $nombre
     * @param string $localizador
     */
    public function __construct($nombre, $localizador)
    {
        $this->nombre = $nombre;
        $this->localizador = $localizador;
    }

    /**
     * Construir el mensaje.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Candidatura Registrada')
                    ->view('emails.candidatura-registrada');
    }
}
