import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from '@inertiajs/react';
import NavigationAdmin from '../../Components/NavigationAdmin';
import Footer from '../../Components/Footer';
import SobreNosotros from '../../Components/Sobrenosotros';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faStore, faCartPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function PedidosProveedores() {
    const [productos, setProductos] = useState([]);
    const [productosSeleccionados, setProductosSeleccionados] = useState({});
    const [cantidades, setCantidades] = useState({});
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        axios.get('/api/productos')
            .then(response => {
                setProductos(response.data);
                setCargando(false);
            })
            .catch(error => {
                console.error("Error al obtener productos:", error);
                setCargando(false);
            });
    }, []);

    const toggleSeleccion = (productoId) => {
        setProductosSeleccionados(prev => ({
            ...prev,
            [productoId]: !prev[productoId] // Alternar selección
        }));
    };

    const handleCantidadChange = (productoId, cantidad) => {
        setCantidades(prev => ({
            ...prev,
            [productoId]: Math.max(1, cantidad)
        }));
    };

    const handleRealizarPedido = () => {
        const productosPedido = Object.keys(productosSeleccionados)
            .filter(id => productosSeleccionados[id]) // Filtrar solo los seleccionados
            .map(id => ({
                producto_id: id,
                cantidad: cantidades[id] || 1 // Si no hay cantidad ingresada, asignar 1
            }));

        if (productosPedido.length === 0) {
            Swal.fire("Selecciona productos", "Debes añadir al menos un producto al pedido.", "warning");
            return;
        }

        Swal.fire({
            title: '¿Confirmar pedido?',
            text: "Se enviará un pedido a los proveedores seleccionados.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, enviar pedido',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post('/api/admin/pedidos-proveedores', { productos: productosPedido })
                    .then(response => {
                        Swal.fire('Pedido enviado', 'El pedido se ha registrado con éxito.', 'success');
                        setProductosSeleccionados({});
                        setCantidades({});
                    })
                    .catch(error => {
                        console.error("Error al realizar el pedido:", error);
                        Swal.fire('Error', 'Hubo un problema al realizar el pedido.', 'error');
                    });
            }
        });
    };

    return (
        <div className="admin-dashboard min-h-screen bg-cover bg-center"
            style={{ backgroundImage: `url('/images/barberia.jpg')`, backgroundAttachment: 'fixed' }}>

            <NavigationAdmin />

            <div className="container mx-auto p-8">
                <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg w-full max-w-4xl mx-auto mt-12 relative">

                    {/* Botón "X" para salir */}
                    <div className="absolute top-2 right-2">
                        <Link href="/opciones" className="text-gray-600 text-xl font-bold hover:text-red-500">
                            <FontAwesomeIcon icon={faTimes} />
                        </Link>
                    </div>

                    <h1 className="text-4xl font-extrabold text-center text-[#000000] mb-6">Realizar Pedido a Proveedores</h1>

                    {cargando ? (
                        <p className="text-center text-gray-500">Cargando productos...</p>
                    ) : (
                        <div className="space-y-6">
                            {productos.map((producto) => (
                                <div key={producto.id} className={`p-4 border rounded-lg shadow bg-white flex items-center space-x-4 transition-transform ${productosSeleccionados[producto.id] ? 'ring-2 ring-[#A87B43] scale-105' : ''}`}>

                                    {/* Checkbox de selección */}
                                    <input
                                        type="checkbox"
                                        checked={!!productosSeleccionados[producto.id]}
                                        onChange={() => toggleSeleccion(producto.id)}
                                        className="h-5 w-5 text-[#A87B43] cursor-pointer"
                                    />

                                    {/* Imagen del producto */}
                                    <img
                                        src={producto.imagen ? `/storage/${producto.imagen}` : '/images/default-product.png'}
                                        alt={producto.nombre}
                                        className="w-16 h-16 object-cover rounded-md"
                                    />

                                    <div className="text-left flex-grow">
                                        <p><FontAwesomeIcon icon={faBox} className="mr-2 text-gray-600" /> <strong>Producto:</strong> {producto.nombre}</p>

                                        <p><strong>Precio proveedor:</strong> {(Number(producto.precio_proveedor) || 0).toFixed(2)}€</p>
                                    </div>

                                    {/* Cantidad de pedido */}
                                    {productosSeleccionados[producto.id] && (
                                        <input
                                            type="number"
                                            className="w-20 px-3 py-2 border rounded-lg text-center"
                                            min="1"
                                            value={cantidades[producto.id] || ""}
                                            onChange={(e) => handleCantidadChange(producto.id, parseInt(e.target.value, 10))}
                                            placeholder="Cant."
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="text-center mt-6">
                        <button
                            className="px-6 py-3 text-white bg-[#A87B43] font-semibold rounded-lg hover:bg-[#875d34] transition-all duration-200"
                            onClick={handleRealizarPedido}
                        >
                            <FontAwesomeIcon icon={faCartPlus} className="mr-2" /> Realizar Pedido
                        </button>
                    </div>
                </div>
            </div>

            <br /><br /><br />
            <SobreNosotros />
            <Footer />
        </div>
    );
}
