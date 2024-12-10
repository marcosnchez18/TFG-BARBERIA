<!DOCTYPE html>
<html>
<head>
    <title>Cancelación de tu cita</title>
</head>
<body>
    <h1>Hola {{ $nombreCliente }},</h1>
    <p>Lamentamos informarte que tu cita programada para el día {{ $fechaCita }} ha sido cancelada por la barbería.</p>

    @if($metodoPago === 'adelantado')
        <p>El monto pagado será reembolsado a tu saldo en nuestra plataforma.</p>
    @endif

    <p>Si tienes alguna duda, no dudes en contactarnos.</p>

    <p>Saludos,<br>Equipo de la Barbería</p>
</body>
</html>
