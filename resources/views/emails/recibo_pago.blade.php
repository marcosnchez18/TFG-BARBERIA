<!-- resources/views/emails/recibo_pago.blade.php -->

<!DOCTYPE html>
<html>
<head>
    <title>Recibo de Pago</title>
</head>
<body>
    <h2>Recibo de Pago - Cita Confirmada</h2>
    <p><strong>Barbero:</strong> {{ $cita->barbero->nombre }}</p>
    <p><strong>Servicio:</strong> {{ $cita->servicio->nombre }} - {{ $cita->servicio->precio }}€</p>
    <p><strong>Fecha y Hora:</strong> {{ $cita->fecha_hora_cita->format('d/m/Y H:i') }}</p>
    <p><strong>Método de Pago:</strong> Adelantado (PayPal)</p>
    <p>¡Gracias por su preferencia!</p>
</body>
</html>
