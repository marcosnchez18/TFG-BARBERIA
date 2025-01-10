<?php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PedidoRealizadoMail extends Mailable
{
    use Queueable, SerializesModels;

    public $pedido; // Pedido que será enviado al correo

    /**
     * Create a new message instance.
     *
     * @param $pedido
     */
    public function __construct($pedido)
    {
        $this->pedido = $pedido;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('emails.pedido_realizado')
            ->subject('¡Gracias por tu compra!')
            ->with([
                'pedido' => $this->pedido,
            ]);
    }
}
