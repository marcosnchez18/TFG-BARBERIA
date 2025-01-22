import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../../css/Barber.css';
import NavigationCliente from '@/Components/NavigationCliente';
import Footer from '../../Components/Footer';
import Localizacion from '../../Components/Localizacion';
import SobreNosotros from '../../Components/Sobrenosotros';
import WhatsAppButton from '@/Components/Wasa';
import Productos from '../../Components/Productos';
import Carrito from '../../Components/Carrito';
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

    const verProducto = (producto) => {
        setProductoSeleccionado(producto); // Actualiza el estado con el producto seleccionado
    };


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

    const agregarAlCarrito = (producto) => {
        const productoExistente = carrito.find((item) => item.id === producto.id);

        if (productoExistente) {
            if (productoExistente.cantidad + 1 > producto.stock) {
                Swal.fire(
                    "Stock insuficiente",
                    `No puedes agregar más de ${producto.stock} unidades de este producto.`,
                    "warning"
                );
                return;
            }

            setCarrito(
                carrito.map((item) =>
                    item.id === producto.id
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                )
            );
        } else {
            if (producto.stock < 1) {
                Swal.fire(
                    "Producto agotado",
                    "Este producto no tiene unidades disponibles.",
                    "error"
                );
                return;
            }

            setCarrito([...carrito, { ...producto, cantidad: 1 }]);
        }

        setAnimarCarrito(true);
        setTimeout(() => setAnimarCarrito(false), 500);
    };

    useEffect(() => {
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }, [carrito]);

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

    const eliminarDelCarrito = (idProducto) => {
        setCarrito(carrito.filter((item) => item.id !== idProducto));
    };

    const totalCarrito = carrito.reduce(
        (total, producto) => total + producto.precio * producto.cantidad,
        0
    );

    const vaciarCarrito = () => {
        setCarrito([]);
        localStorage.removeItem("carrito");
    };

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

        const timer = setTimeout(() => {
            setMostrarHero(false);
        }, 4000);

        return () => clearTimeout(timer);
    }, []);

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
    <section className="hero-section" onClick={() => setMostrarHero(false)}>
        <div className="hero-text" onClick={(e) => e.stopPropagation()}>
            <h2>¡Bienvenido a Nuestra Tienda!</h2>
            <p>Encuentra productos exclusivos para ti. ¡Haz tu compra ahora!</p>
        </div>
    </section>
)}


<Productos
    productos={productos}
    agregarAlCarrito={agregarAlCarrito}
    verProducto={verProducto} // Pasa la función al componente Productos
    cargando={cargando}
/>


            <Carrito
                carrito={carrito}
                disminuirCantidad={disminuirCantidad}
                aumentarCantidad={aumentarCantidad}
                eliminarDelCarrito={eliminarDelCarrito}
                totalCarrito={totalCarrito}
                tramitarPedido={tramitarPedido}
                vaciarCarrito={vaciarCarrito}
                mostrarCarrito={mostrarCarrito}
                setMostrarCarrito={setMostrarCarrito}
                animarCarrito={animarCarrito}
                manejarCarritoClick={manejarCarritoClick}
            />

            <Localizacion />
            <SobreNosotros />
            <Footer />
            <WhatsAppButton />
        </div>
    );
}
