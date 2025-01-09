import React from 'react';
import Swal from 'sweetalert2';

export default function Productos({ productos, agregarAlCarrito, verProducto, cargando }) {
    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-6">
                <h2 className="text-5xl font-extrabold mb-8 text-center text-blue-900">
                    Productos Disponibles
                </h2>

                <br /><br />

                {cargando ? (
                    <div className="text-center text-gray-600">Cargando productos...</div>
                ) : productos.length === 0 ? (
                    <p className="text-center text-gray-600">
                        Actualmente no hay productos disponibles. Vuelve pronto.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {productos.map((producto) => (
                            <div
                                key={producto.id}
                                className={`relative bg-white p-6 rounded-lg shadow-lg ${
                                    producto.stock === 0 ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                            >
                                {/* Imagen con efecto si no hay stock */}
                                <div
                                    className="relative"
                                    onClick={() => producto.stock > 0 && verProducto(producto)}
                                >
                                    <img
                                        src={`/storage/${producto.imagen}`}
                                        alt={producto.nombre}
                                        className="w-full h-80 object-cover rounded-md cursor-pointer"
                                    />
                                    {producto.stock === 0 && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
                                            <span className="text-white text-lg font-bold animate-pulse">
                                                Sin stock
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <br />
                                <h3 className="text-xl font-bold text-gray-700 mb-3">{producto.nombre}</h3>
                                <p className="text-gray-600 mb-4">{producto.descripcion}</p>
                                <p className="text-lg font-semibold text-gray-900 mb-4">{producto.precio} €</p>

                                {/* Botón deshabilitado si no hay stock */}
                                <button
                                    onClick={() => producto.stock > 0 && agregarAlCarrito(producto)}
                                    className={`px-4 py-2 rounded ${
                                        producto.stock === 0
                                            ? "bg-gray-400 text-white cursor-not-allowed"
                                            : "bg-blue-500 text-white hover:bg-blue-600"
                                    }`}
                                    disabled={producto.stock === 0}
                                >
                                    {producto.stock === 0 ? "Agotado" : "Agregar al carrito"}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
