<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CitaModificada extends Notification
{
    use Queueable;

    protected $cita;

    /**
     * Create a new notification instance.
     *
     * @param  $cita
     */
    public function __construct($cita)
    {
        $this->cita = $cita;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Tu cita ha sido modificada')
            ->greeting('Hola ' . $notifiable->nombre . ',')
            ->line('Tu cita ha sido modificada con los siguientes detalles:')
            ->line('Fecha: ' . $this->cita->fecha_hora_cita->format('d-m-Y H:i'))
            ->line('Servicio: ' . $this->cita->servicio->nombre)
            ->line('Barbero: ' . $this->cita->barbero->nombre)
            ->line('Método de Pago: ' . $this->cita->metodo_pago)
            ->line('Estado: ' . ucfirst($this->cita->estado))
            ->line('Gracias por confiar en nosotros.');
    }
}
