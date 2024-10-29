@component('mail::message')
# Confirmación de Cita

¡Hola, {{ $user->nombre }}!

Tu cita ha sido reservada con éxito.

**Barbero:**
{{ $cita->barbero->nombre }}

**Servicio:**
{{ $cita->servicio->nombre }}

**Fecha y Hora:**
{{ \Carbon\Carbon::parse($cita->fecha_hora_cita)->format('d/m/Y H:i') }}

Gracias por confiar en nosotros.

@component('mail::button', ['url' => url('/')])
Ir al sitio web
@endcomponent

Saludos,
{{ config('app.name') }}
@endcomponent
