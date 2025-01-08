<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;
use App\Models\Servicio;
use App\Models\Cita;
use Carbon\Carbon;

class CitaCanceladaPorServicio extends Mailable
{
    use Queueable, SerializesModels;

    public $usuario;
    public $servicio;
    public $cita;

    /**
     * Create a new message instance.
     */
    public function __construct(User $usuario, Servicio $servicio, Cita $cita)
    {
        $this->usuario = $usuario;
        $this->servicio = $servicio;
        $this->cita = $cita;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('Tu cita ha sido cancelada')
                    ->view('emails.cita_cancelada')
                    ->with([
                        'nombreUsuario' => $this->usuario->nombre,
                        'nombreServicio' => $this->servicio->nombre,
                        'fechaCita' => Carbon::parse($this->cita->fecha_hora_cita)->format('d/m/Y H:i'),
                    ]);
    }
}
