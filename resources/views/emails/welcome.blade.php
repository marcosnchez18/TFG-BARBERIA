@component('mail::message')
# Bienvenido, {{ $user->nombre }}.
<br><br>
Número de tarjeta VIP: {{ $user->numero_tarjeta_vip }}

Gracias por registrarte en Barber's 18.

Estamos encantados de tenerte con nosotros.

@component('mail::button', ['url' => route('home')])
Visita nuestra web
@endcomponent

Reciba un cordial saludo de parte de esta gran familia.
<br><br>

@endcomponent
