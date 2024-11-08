<!DOCTYPE html>
<html>
<head>
    <title>Motivo Cancelación de Cita</title>
</head>
<body>
    <h1>Cancelación de Cita</h1>
    <p><strong>Usuario:</strong> {{ $usuario->nombre }}</p>
    <p><strong>Fecha y Hora de la Cita:</strong> {{ \Carbon\Carbon::parse($fechaHoraCita)->format('d/m/Y H:i') }}</p>
    <p><strong>Servicio:</strong> {{ $servicio }}</p>
    <p><strong>Barbero:</strong> {{ $barbero }}</p>
    <p><strong>Explicación del Cliente:</strong> {{ $mensajeExplicacion }}</p>
    <p>Gracias,</p>
    <p>El equipo de la barbería</p>
</body>
</html>
