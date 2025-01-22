import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export default function Productos({ productos, agregarAlCarrito, verProducto, cargando }) {
    const [filtroPrecio, setFiltroPrecio] = useState('');
    const [rangoPrecio, setRangoPrecio] = useState(0);
    const [precioMaximo, setPrecioMaximo] = useState(0);
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    

    useEffect(() => {
        if (productos.length > 0) {
            const maxPrecio = Math.max(...productos.map((producto) => producto.precio));
            setPrecioMaximo(maxPrecio);
            setRangoPrecio(maxPrecio);
        }
    }, [productos]);

    const productosFiltrados = productos
        .filter((producto) => producto.precio <= rangoPrecio)
        .sort((a, b) => {
            if (filtroPrecio === 'asc') return a.precio - b.precio;
            if (filtroPrecio === 'desc') return b.precio - a.precio;
            return 0;
        });

    return (
        <section className="py-12 bg-white relative">
            <div className="container mx-auto px-6">
                <h2 className="text-5xl font-extrabold mb-8 text-center text-blue-900">
                    Productos Disponibles
                </h2>
                <br /><br />

                {/* Botón de filtro */}
                <div className="absolute top-0 right-0 mt-4 mr-4 z-50">
                    <br /><br />
                    <button
                        className="bg-blue-500 text-white px-3 py-2 rounded-lg flex items-center gap-1 text-sm"
                        onClick={() => setMostrarFiltros(!mostrarFiltros)}
                    >
                        🛠️ Filtrar
                    </button>
                </div>

                {/* Opciones de filtros */}
{mostrarFiltros && (
    <div
        className="absolute top-12 right-4 bg-white border border-gray-300 p-4 rounded-lg shadow-lg w-64 z-50"
        style={{ zIndex: 50 }}
    >
        {/* Botón para cerrar filtros */}
        <button
            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-lg font-bold"
            onClick={() => setMostrarFiltros(false)}
            aria-label="Cerrar"
        >
            ✖
        </button>

        <h3 className="text-sm font-bold mb-4">Opciones de Filtro:</h3>

        {/* Ordenar por */}
        <div className="mb-4">
            <label className="text-sm font-bold text-gray-600 mb-1 block">
                Ordenar por:
            </label>
            <select
                className="border rounded-lg px-2 py-1 w-full text-sm"
                value={filtroPrecio}
                onChange={(e) => setFiltroPrecio(e.target.value)}
            >
                <option value="">Seleccionar</option>
                <option value="asc">Precio: de menor a mayor</option>
                <option value="desc">Precio: de mayor a menor</option>
            </select>
        </div>

        {/* Rango de precio */}
        <div className="mb-4">
            <label className="text-sm font-bold text-gray-600 mb-1 block">
                Rango de precio:
            </label>
            <input
                type="range"
                min="0"
                max={precioMaximo}
                value={rangoPrecio}
                onChange={(e) => setRangoPrecio(Number(e.target.value))}
                className="w-full"
            />
            <p className="text-xs text-gray-600 mt-1">
                Máximo: <span className="font-bold">{rangoPrecio} €</span>
            </p>
        </div>

        {/* Botón para aplicar filtros */}
        <button
            className="mt-2 bg-blue-500 text-white px-3 py-1 rounded-lg text-sm w-full"
            onClick={() => setMostrarFiltros(false)}
        >
            Aplicar Filtros
        </button>
    </div>
)}


                {/* Productos */}
                {cargando ? (
                    <div className="text-center text-gray-600">Cargando productos...</div>
                ) : productosFiltrados.length === 0 ? (
                    <p className="text-center text-gray-600">
                        No hay productos disponibles en este rango de precio. Intenta con otro filtro.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {productosFiltrados.map((producto) => (
                            <div
                                key={producto.id}
                                className={`relative bg-white p-6 rounded-lg shadow-lg ${
                                    producto.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                <div
    className="relative group"
    onClick={() => producto.stock > 0 && verProducto(producto)}
>
    <img
        src={`/storage/${producto.imagen}`}
        alt={producto.nombre}
        className="w-full h-80 object-cover rounded-md cursor-pointer transform transition-transform duration-300 group-hover:scale-110"
    />
    {producto.stock === 0 && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
            <span className="text-white text-lg font-bold animate-pulse">
                Sin stock
            </span>
        </div>
    )}
</div>


                                <h3 className="text-xl font-bold text-gray-700 mb-3 mt-4">
                                    {producto.nombre}
                                </h3>
                                <p className="text-gray-600 mb-4">{producto.descripcion}</p>
                                <p className="text-lg font-semibold text-gray-900 mb-4">
                                    {producto.precio} €
                                </p>

                                <button
                                    onClick={() => producto.stock > 0 && agregarAlCarrito(producto)}
                                    className={`px-4 py-2 rounded ${
                                        producto.stock === 0
                                            ? 'bg-gray-400 text-white cursor-not-allowed'
                                            : 'bg-blue-500 text-white hover:bg-blue-600'
                                    }`}
                                    disabled={producto.stock === 0}
                                >
                                    {producto.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
