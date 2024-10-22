@component('mail::message')
# Bienvenido, {{ $user->nombre }}.
<br><br>
Número de tarjeta VIP: {{ $user->numero_tarjeta_vip }}

Gracias por registrarte en Barber's 18.

Estamos encantados de tenerte con nosotros.

@component('mail::button', ['url' => route('home')])
Visita nuestra web
@endcomponent

Reciba un cordial saludo.
<br><br>
Barber's 18 company S.L
@endcomponent
