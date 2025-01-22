import React from 'react';
import Swal from 'sweetalert2';

export default function Carrito({
    carrito,
    disminuirCantidad,
    aumentarCantidad,
    eliminarDelCarrito,
    totalCarrito,
    tramitarPedido,
    vaciarCarrito,
    mostrarCarrito,
    setMostrarCarrito,
    animarCarrito,
    manejarCarritoClick,
}) {
    return (
        <>
            {/* Icono del carrito */}
            <div
                className={`carrito-logo ${animarCarrito ? 'balancin' : ''}`}
                onClick={manejarCarritoClick}
            >
                <i className="fas fa-shopping-cart"></i>
                {carrito.length > 0 && (
                    <span className="cantidad-carrito">{carrito.length}</span>
                )}
            </div>

            {/* Mostrar productos en el carrito */}
            {mostrarCarrito && (
                <div className="fixed top-10 right-4 bg-white rounded-lg shadow-lg p-6 w-80 z-50">
                    <div className="relative">
                        <button
                            onClick={() => setMostrarCarrito(false)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl font-bold focus:outline-none"
                        >
                            ×
                        </button>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 text-center mb-4">
                        Tu Carrito
                    </h3>
                    {carrito.length === 0 ? (
                        <p className="text-gray-500 text-center">
                            Tu carrito está vacío.
                        </p>
                    ) : (
                        <>
                            <div className="divide-y divide-gray-200 max-h-72 overflow-y-auto">
                                {carrito.map((producto) => (
                                    <div
                                        key={producto.id}
                                        className="py-4 flex items-start"
                                    >
                                        <img
                                            src={`/storage/${producto.imagen}`}
                                            alt={producto.nombre}
                                            className="w-12 h-12 object-cover rounded-md"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-800 text-center">
                                                {producto.nombre}
                                            </h4>
                                            <p className="text-gray-600 text-center line-through">
                                                {(producto.precio * 1.2).toFixed(2)} €
                                            </p>
                                            <p className="text-gray-800 text-center">
                                                {producto.precio} €
                                            </p>
                                            <div className="flex items-center justify-center mt-2 space-x-2">
                                                <button
                                                    onClick={() =>
                                                        disminuirCantidad(producto.id)
                                                    }
                                                    className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                                >
                                                    -
                                                </button>
                                                <span className="px-2 text-gray-700">
                                                    {producto.cantidad}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        aumentarCantidad(producto.id)
                                                    }
                                                    className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                                >
                                                    +
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        eliminarDelCarrito(producto.id)
                                                    }
                                                    className="ml-auto text-red-500 hover:text-red-700"
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <hr className="my-4 border-t border-gray-300" />
                            <div className="mt-4">
                                <p className="text-lg font-semibold text-gray-800 text-center">
                                    Total: {totalCarrito.toFixed(2)} €
                                </p>
                                <button
                                    className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                                    onClick={tramitarPedido}
                                >
                                    Tramitar Pedido
                                </button>
                                <button
                                    className="w-full mt-2 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                                    onClick={vaciarCarrito}
                                >
                                    Vaciar Cesta
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
}
