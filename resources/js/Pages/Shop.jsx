import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../css/Barber.css';
import NavigationCliente from '@/Components/NavigationCliente';
import Footer from '../Components/Footer';
import Localizacion from '../Components/Localizacion';
import SobreNosotros from '../Components/Sobrenosotros';
import WhatsAppButton from '@/Components/Wasa';
import Productos from '../Components/Productos';
import { Inertia } from "@inertiajs/inertia";

export default function Shop() {
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState(() => {
        const carritoGuardado = localStorage.getItem("carrito");
        return carritoGuardado ? JSON.parse(carritoGuardado) : [];
    });

    const [cargando, setCargando] = useState(true);
    const [mostrarHero, setMostrarHero] = useState(true);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [animarCarrito, setAnimarCarrito] = useState(false);
    const [mostrarCarrito, setMostrarCarrito] = useState(false);

    const tramitarPedido = () => {
        if (carrito.length === 0) {
            Swal.fire("Tu carrito está vacío", "¡Agrega productos para continuar!", "warning");
            return;
        }

        axios.post('/guardar-carrito', { carrito })
            .then(() => {
                Inertia.visit('/tramitar-pedido');
            })
            .catch(error => {
                console.error("Error al guardar el carrito:", error);
                Swal.fire('Error', 'No se pudo guardar el carrito.', 'error');
            });
    };


    // Función para agregar productos al carrito
    const agregarAlCarrito = (producto) => {
        const productoExistente = carrito.find((item) => item.id === producto.id);

        if (productoExistente) {
            // Si ya existe en el carrito, verifica que la cantidad no exceda el stock
            if (productoExistente.cantidad + 1 > producto.stock) {
                Swal.fire(
                    "Stock insuficiente",
                    `No puedes agregar más de ${producto.stock} unidades de este producto.`,
                    "warning"
                );
                return;
            }

            // Si hay suficiente stock, incrementa la cantidad
            setCarrito(
                carrito.map((item) =>
                    item.id === producto.id
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                )
            );
        } else {
            // Si no existe en el carrito, verifica que haya stock disponible
            if (producto.stock < 1) {
                Swal.fire(
                    "Producto agotado",
                    "Este producto no tiene unidades disponibles.",
                    "error"
                );
                return;
            }

            // Si hay stock, agrega el producto al carrito
            setCarrito([...carrito, { ...producto, cantidad: 1 }]);
        }

        setAnimarCarrito(true);
        setTimeout(() => setAnimarCarrito(false), 500);
    };


    useEffect(() => {
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }, [carrito]);


    // Función para disminuir la cantidad de productos en el carrito
    const disminuirCantidad = (idProducto) => {
        const productoExistente = carrito.find((item) => item.id === idProducto);

        if (productoExistente.cantidad > 1) {
            setCarrito(
                carrito.map((item) =>
                    item.id === idProducto
                        ? { ...item, cantidad: item.cantidad - 1 }
                        : item
                )
            );
        } else {
            eliminarDelCarrito(idProducto);
        }
    };

    // Función para aumentar la cantidad de productos en el carrito
    const aumentarCantidad = (idProducto) => {
        const productoExistente = carrito.find((item) => item.id === idProducto);

        if (productoExistente && productoExistente.cantidad + 1 > productoExistente.stock) {
            Swal.fire(
                "Stock insuficiente",
                `No puedes agregar más de ${productoExistente.stock} unidades de este producto.`,
                "warning"
            );
            return;
        }

        setCarrito(
            carrito.map((item) =>
                item.id === idProducto
                    ? { ...item, cantidad: item.cantidad + 1 }
                    : item
            )
        );
    };


    // Función para eliminar productos del carrito
    const eliminarDelCarrito = (idProducto) => {
        setCarrito(carrito.filter((item) => item.id !== idProducto));
    };

    // Total del carrito
    const totalCarrito = carrito.reduce(
        (total, producto) => total + producto.precio * producto.cantidad,
        0
    );

    const vaciarCarrito = () => {
        setCarrito([]);
        localStorage.removeItem("carrito");
    };


    // Obtener productos desde la API
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

        return () => clearTimeout(timer);
    }, []);


    useEffect(() => {
        const ocultarHero = () => setMostrarHero(false);

        // Ocultar Hero después de 4 segundos
        const timer = setTimeout(ocultarHero, 4000);

        // Agregar evento de clic en toda la pantalla
        document.addEventListener('click', ocultarHero);

        return () => {
            clearTimeout(timer); // Limpiar el timeout si el usuario hace clic antes
            document.removeEventListener('click', ocultarHero); // Eliminar evento cuando se desmonte
        };
    }, []);


    // Ver detalles de un producto
    const verProducto = (producto) => {
        setProductoSeleccionado(producto);
    };

    // Cerrar modal de producto
    const cerrarModal = () => {
        setProductoSeleccionado(null);
    };

    // Manejar el click en el icono del carrito
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
            <NavigationCliente />

            {mostrarHero && (
    <section className="hero-section">
        <div className="hero-text">
            <h2>¡Bienvenido a Nuestra Tienda!</h2>
            <p>Encuentra productos exclusivos para ti. ¡Haz tu compra ahora!</p>
        </div>
    </section>
)}


            {/* Aquí se usa el componente Productos */}
            <Productos
                productos={productos}
                agregarAlCarrito={agregarAlCarrito}
                verProducto={verProducto}
                cargando={cargando}
            />

            {/* Modal para ver el producto en grande */}
            {productoSeleccionado && (
                <div className={`modal ${productoSeleccionado ? 'active' : ''}`}>
                    <div className="modal-content">
                        <button className="close" onClick={cerrarModal}>×</button>
                        <img
                            src={`/storage/${productoSeleccionado.imagen}`}
                            alt={productoSeleccionado.nombre}
                            className="w-full h-auto rounded-lg"
                        />
                        <h3 className="text-xl font-bold text-gray-800 mt-4">{productoSeleccionado.nombre}</h3>
                        <p className="text-gray-600 mt-2">{productoSeleccionado.descripcion}</p>
                        <p className="text-lg font-semibold text-gray-900 mt-4">{productoSeleccionado.precio} €</p>
                        <button
                            onClick={() => agregarAlCarrito(productoSeleccionado)}
                            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                        >
                            Agregar al carrito
                        </button>
                    </div>
                </div>
            )}

            {/* Carrito con icono */}
            <div
                className={`carrito-logo ${animarCarrito ? 'balancin' : ''}`}
                onClick={manejarCarritoClick}
            >
                <i className="fas fa-shopping-cart"></i>
                {carrito.length > 0 && (
                    <span className="cantidad-carrito">
                        {carrito.length}
                    </span>
                )}
            </div>

            {/* Mostrar productos en el carrito debajo del logo */}
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
                    <h3 className="text-lg font-semibold text-gray-800 text-center mb-4">Tu Carrito</h3>
                    {carrito.length === 0 ? (
                        <p className="text-gray-500 text-center">Tu carrito está vacío.</p>
                    ) : (
                        <>
                            <div className="divide-y divide-gray-200 max-h-72 overflow-y-auto">
                                {carrito.map((producto) => (
                                    <div key={producto.id} className="py-4 flex items-start">
                                        <img
                                            src={`/storage/${producto.imagen}`}
                                            alt={producto.nombre}
                                            className="w-12 h-12 object-cover rounded-md"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-800 text-center">{producto.nombre}</h4>
                                            <p className="text-gray-600 text-center line-through">{(producto.precio * 1.2).toFixed(2)} €</p>
                                            <p className="text-gray-800 text-center">{producto.precio} €</p>
                                            <div className="flex items-center justify-center mt-2 space-x-2">
                                                <button
                                                    onClick={() => disminuirCantidad(producto.id)}
                                                    className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                                >
                                                    -
                                                </button>
                                                <span className="px-2 text-gray-700">{producto.cantidad}</span>
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

            <Localizacion />
            <SobreNosotros />
            <Footer />
            <WhatsAppButton />
        </div>
    );
}
