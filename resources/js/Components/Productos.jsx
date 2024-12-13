// src/Components/Productos.jsx

import React from 'react';
import Swal from 'sweetalert2'; // Importamos SweetAlert2

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
                            <div key={producto.id} className="bg-white p-6 rounded-lg shadow-lg">
                                <img
                                    src={`/storage/${producto.imagen}`}
                                    alt={producto.nombre}
                                    className="w-full h-80 object-cover rounded-md cursor-pointer"
                                    onClick={() => verProducto(producto)}
                                />
                                <br />
                                <h3 className="text-xl font-bold text-gray-700 mb-3">{producto.nombre}</h3>
                                <p className="text-gray-600 mb-4">{producto.descripcion}</p>
                                <p className="text-lg font-semibold text-gray-900 mb-4">{producto.precio} €</p>

                                <button
                                    onClick={() => agregarAlCarrito(producto)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Agregar al carrito
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
