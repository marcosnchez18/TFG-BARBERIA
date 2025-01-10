<!DOCTYPE html>
<html>
<head>
    <title>Tu cita ha sido cancelada</title>
</head>
<body>
    <h2>Hola, {{ $nombreUsuario }}</h2>
    <p>Lamentamos informarte que tu cita para el servicio de <strong>{{ $nombreServicio }}</strong> programada para el día <strong>{{ $fechaCita }}</strong> ha sido cancelada.</p>
    <p>Esto se debe a que el servicio ya no está disponible en nuestra barbería.</p>
    <p>Si deseas, puedes reservar otro servicio en nuestra web.</p>
    <br>
    <p>Gracias por tu comprensión.</p>
    <p>Atentamente, el equipo de Barber's 18.</p>
</body>
</html>
