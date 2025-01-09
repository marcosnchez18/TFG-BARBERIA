<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pedido Realizado</title>
</head>
<body>
    <h1>¡Gracias por tu compra, {{ $pedido['usuario']['nombre'] }}!</h1>
    <p>Tu pedido ha sido confirmado con éxito.</p>

    <h2>Detalles del pedido #{{ $pedido['id'] }}:</h2>
    <ul>
        @foreach ($pedido['productos'] as $producto)
            <li>
                <strong>{{ $producto['nombre'] }}</strong>: {{ $producto['cantidad'] }} x {{ number_format($producto['precio'], 2) }}€
            </li>
        @endforeach
    </ul>

    <p><strong>Total:</strong> {{ number_format($pedido['total'], 2) }}€</p>

    <p><strong>Método de entrega:</strong> {{ $pedido['metodo_entrega'] }}</p>
    @if ($pedido['direccion'])
        <p><strong>Dirección de entrega:</strong> {{ $pedido['direccion'] }}</p>
    @else
        <p><strong>Recogida en tienda</strong></p>
    @endif

    <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
</body>
</html>
