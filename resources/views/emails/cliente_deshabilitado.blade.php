<!DOCTYPE html>
<html>
<head>
    <title>Tu cuenta ha sido deshabilitada</title>
</head>
<body>
    <p>Hola {{ $cliente->nombre }},</p>

    <p>Lamentamos informarte que tu cuenta ha sido deshabilitada. Si deseas más información o reactivar tu cuenta, ponte en contacto con nosotros.</p>

    <p>
        <a href="{{ $contactoUrl }}"
           style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px;">
            Contactar con Soporte
        </a>
    </p>

    <p>Gracias,</p>
    <p>El equipo de soporte</p>
</body>
</html>
