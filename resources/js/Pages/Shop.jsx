import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Importamos SweetAlert2
import '../../css/Barber.css';
import NavigationCliente from '@/Components/NavigationCliente';
import Footer from '../Components/Footer';
import Localizacion from '../Components/Localizacion';
import SobreNosotros from '../Components/Sobrenosotros';
import WhatsAppButton from '@/Components/Wasa';

export default function TiendaPrincipal() {
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [mostrarHero, setMostrarHero] = useState(true);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null); // Estado para el producto en el modal
    const [animarCarrito, setAnimarCarrito] = useState(false); // Estado para controlar la animación del carrito
    const [mostrarCarrito, setMostrarCarrito] = useState(false); // Estado para mostrar el carrito



const agregarAlCarrito = (producto) => {
    const productoExistente = carrito.find((item) => item.id === producto.id);

    if (productoExistente) {
        // Si el producto ya está en el carrito, aumentamos su cantidad
        setCarrito(
            carrito.map((item) =>
                item.id === producto.id
                    ? { ...item, cantidad: item.cantidad + 1 }
                    : item
            )
        );
    } else {
        // Si el producto no está en el carrito, lo agregamos con cantidad inicial 1
        setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }

    setAnimarCarrito(true); // Activar la animación de balanceo
    setTimeout(() => setAnimarCarrito(false), 500); // Desactivar animación
};

// Función para disminuir la cantidad de un producto en el carrito
const disminuirCantidad = (idProducto) => {
    const productoExistente = carrito.find((item) => item.id === idProducto);

    if (productoExistente.cantidad > 1) {
        // Si la cantidad es mayor a 1, simplemente la disminuimos
        setCarrito(
            carrito.map((item) =>
                item.id === idProducto
                    ? { ...item, cantidad: item.cantidad - 1 }
                    : item
            )
        );
    } else {
        // Si la cantidad es 1, eliminamos el producto del carrito
        eliminarDelCarrito(idProducto);
    }
};

// Función para aumentar la cantidad de un producto en el carrito
const aumentarCantidad = (idProducto) => {
    setCarrito(
        carrito.map((item) =>
            item.id === idProducto
                ? { ...item, cantidad: item.cantidad + 1 }
                : item
        )
    );
};

// Función para eliminar un producto del carrito
const eliminarDelCarrito = (idProducto) => {
    setCarrito(carrito.filter((item) => item.id !== idProducto));
};

// Calcular el total del carrito
const totalCarrito = carrito.reduce(
    (total, producto) => total + producto.precio * producto.cantidad,
    0
);


    // Función para obtener los productos desde la API
    useEffect(() => {
        axios.get('/api/productos')
            .then((response) => {
                setProductos(response.data);
                setCargando(false);
            })
            .catch((error) => {
                console.error("Error al obtener los productos:", error);
                setCargando(false);
            });

        // Después de 4 segundos, ocultamos el Hero Section
        const timer = setTimeout(() => {
            setMostrarHero(false);
        }, 4000);

        return () => clearTimeout(timer); // Limpiamos el timer al desmontar
    }, []);


    const verProducto = (producto) => {
        setProductoSeleccionado(producto);
    };


    const cerrarModal = () => {
        setProductoSeleccionado(null);
    };


    const manejarCarritoClick = () => {
        if (carrito.length === 0) {
            Swal.fire({
                title: 'Tu carrito está vacío',
                text: '¡Agrega productos para continuar!',
                icon: 'warning',
                confirmButtonText: 'OK',
            });
        } else {
            setMostrarCarrito(!mostrarCarrito);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navegación */}
            <NavigationCliente />

           
            {mostrarHero && (
                <section className="hero-section">
                    <div className="hero-text">
                        <h2>¡Bienvenido a Nuestra Tienda!</h2>
                        <p>Encuentra productos exclusivos para ti. ¡Haz tu compra ahora!</p>
                    </div>
                </section>
            )}

            {/* Productos en la tienda */}
            <section className="py-12 bg-white">
                <div className="container mx-auto px-6">
                    <h2 className="text-5xl font-extrabold mb-8 text-center text-blue-900">
                        Productos Disponibles
                    </h2>

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
                                        src={producto.imagen}
                                        alt={producto.nombre}
                                        className="w-full h-48 object-cover rounded-md cursor-pointer"
                                        onClick={() => verProducto(producto)} // Al hacer clic, abre el modal
                                    />
                                    <h3 className="text-xl font-bold text-gray-700 mb-3">
                                        {producto.nombre}
                                    </h3>
                                    <p className="text-gray-600 mb-4">{producto.descripcion}</p>
                                    <p className="text-lg font-semibold text-gray-900 mb-4">
                                        {producto.precio} €
                                    </p>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Proveedor: {producto.proveedor_nombre}
                                    </p>
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

            {/* Modal para ver el producto en grande */}
            {productoSeleccionado && (
                <div className="modal active">
                    <div className="modal-content">
                        <button className="close" onClick={cerrarModal}>×</button>
                        <img
                            src={productoSeleccionado.imagen}
                            alt={productoSeleccionado.nombre}
                        />
                        <h3>{productoSeleccionado.nombre}</h3>
                        <p>{productoSeleccionado.descripcion}</p>
                        <p className="text-lg font-semibold text-gray-900">{productoSeleccionado.precio} €</p>
                        <button
                            onClick={() => agregarAlCarrito(productoSeleccionado)}
                            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                        >
                            Agregar al carrito
                        </button>
                    </div>
                </div>
            )}

            {/* Carrito con icono FontAwesome */}
            <div
                className={`carrito-logo ${animarCarrito ? 'balancin' : ''}`}
                onClick={manejarCarritoClick} // Acción para el logo del carrito
            >
                <i className="fas fa-shopping-cart"></i>
                {/* Mostrar número de productos en el carrito */}
                {carrito.length > 0 && (
                    <span className="cantidad-carrito">
                        {carrito.length}
                    </span>
                )}
            </div>

            {/* Mostrar productos en el carrito debajo del logo */}
{mostrarCarrito && (
    <div className="fixed top-20 right-4 bg-white rounded-lg shadow-lg p-6 w-80 z-50">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Tu Carrito</h3>
        {carrito.length === 0 ? (
            <p className="text-gray-500 text-center">Tu carrito está vacío.</p>
        ) : (
            <>
                <div className="divide-y divide-gray-200 max-h-72 overflow-y-auto">
                    {carrito.map((producto) => (
                        <div key={producto.id} className="py-4 flex items-start">
                            <img
                                src={producto.imagen}
                                alt={producto.nombre}
                                className="w-16 h-16 object-cover rounded-md mr-4"
                            />
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-800">{producto.nombre}</h4>
                                <p className="text-gray-600">{producto.precio} €</p>
                                <div className="flex items-center mt-2 space-x-2">
                                    <button
                                        onClick={() => disminuirCantidad(producto.id)}
                                        className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                    >
                                        -
                                    </button>
                                    <span className="px-2">{producto.cantidad}</span>
                                    <button
                                        onClick={() => aumentarCantidad(producto.id)}
                                        className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                    >
                                        +
                                    </button>
                                    <button
                                        onClick={() => eliminarDelCarrito(producto.id)}
                                        className="ml-auto text-red-500 hover:text-red-700"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4">
                    <p className="text-lg font-semibold text-gray-800">
                        Total: {carrito.reduce((total, producto) => total + producto.precio * producto.cantidad, 0).toFixed(2)} €
                    </p>
                    <button
                        className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                        onClick={() => alert('Tramitar pedido')} // Cambia esta función según la lógica de tu pedido
                    >
                        Tramitar Pedido
                    </button>
                </div>
            </>
        )}
    </div>
)}


            {/* Otros componentes */}
            <Localizacion />
            <SobreNosotros />
            <Footer />
            <WhatsAppButton />
        </div>
    );
}
