<!DOCTYPE html>
<html>
<head>
    <title>Cancelación de Cita</title>
</head>
<body>
    <p>Hola {{ $usuario->nombre }},</p>
    <p>Lamentamos informarte que tu cita programada para el {{ $cita->fecha_hora_cita }} con {{ $trabajador->nombre }} ha sido cancelada debido a que el trabajador ya no está disponible.</p>
    @if ($cita->metodo_pago === 'adelantado')
        <p>La cantidad de {{ $cita->precio_cita }} ha sido reembolsado a tu saldo.</p>
    @endif
    <p>Si necesitas más información, no dudes en contactarnos.</p>
    <p>Gracias por tu comprensión.</p>
</body>
</html>
