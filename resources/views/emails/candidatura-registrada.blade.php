<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Candidatura Registrada</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(to right, #e0f7fa, #e1bee7);
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #fff;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            padding: 20px;
        }
        h3 {
            color: #388e3c;
            font-size: 24px;
            font-weight: bold;
        }
        .localizador {
            font-size: 20px;
            font-weight: bold;
            background: #e3f2fd;
            padding: 10px;
            border-radius: 5px;
            display: inline-block;
            color: #1976d2;
            margin: 10px 0;
        }
        a {
            text-decoration: none;
            color: #1976d2;
            font-weight: bold;
        }
        .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="container">
        <h3>¡Candidatura Registrada!</h3>
        <p>Hola, {{ $nombre }}:</p>
        <p>Tu candidatura ha sido registrada con éxito. Este es tu localizador:</p>
        <p class="localizador">{{ $localizador }}</p>
        <p>Puedes consultar el estado de tu candidatura en el apartado <a href="{{ url('/trabaja-nosotros') }}">Trabaja con Nosotros</a>.</p>
        <div class="footer">
            <p>Gracias por confiar en Barber's 18.</p>
        </div>
    </div>
</body>
</html>
