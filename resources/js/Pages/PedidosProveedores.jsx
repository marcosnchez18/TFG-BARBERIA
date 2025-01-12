import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import NavigationAdmin from '../Components/NavigationAdmin';
import Footer from '../Components/Footer';
import SobreNosotros from '../Components/Sobrenosotros';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faStore, faCartPlus } from '@fortawesome/free-solid-svg-icons';

export default function PedidosProveedores() {
    const [productos, setProductos] = useState([]);
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

    const handleCantidadChange = (productoId, cantidad) => {
        setCantidades(prev => ({
            ...prev,
            [productoId]: Math.max(1, cantidad)
        }));
    };

    const handleRealizarPedido = () => {
        const productosPedido = Object.keys(cantidades).map(id => ({
            producto_id: id,
            cantidad: cantidades[id]
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
                <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg w-full max-w-3xl mx-auto mt-12 relative">
                    <h1 className="text-4xl font-extrabold text-center text-[#000000] mb-6">Realizar Pedido a Proveedores</h1>

                    {cargando ? (
                        <p className="text-center text-gray-500">Cargando productos...</p>
                    ) : (
                        <div className="space-y-6">
                            {productos.map((producto) => (
                                <div key={producto.id} className="p-4 border rounded-lg shadow bg-white flex flex-col md:flex-row items-center md:justify-between">
                                    <div className="text-left w-full md:w-2/3">
                                        <p><FontAwesomeIcon icon={faBox} className="mr-2 text-gray-600" /> <strong>Producto:</strong> {producto.nombre}</p>
                                        <p><FontAwesomeIcon icon={faStore} className="mr-2 text-gray-600" /> <strong>Proveedor:</strong> {producto.proveedor?.nombre || "No disponible"}</p>
                                        <p><strong>Precio:</strong> {(Number(producto.precio) || 0).toFixed(2)}€</p>
                                    </div>
                                    <div className="w-full md:w-1/3 flex items-center mt-4 md:mt-0">
                                        <input
                                            type="number"
                                            className="w-20 px-3 py-2 border rounded-lg text-center"
                                            min="1"
                                            value={cantidades[producto.id] || ""}
                                            onChange={(e) => handleCantidadChange(producto.id, parseInt(e.target.value, 10))}
                                            placeholder="Cant."
                                        />
                                    </div>
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
