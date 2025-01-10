import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavigationAdmin from '../Components/NavigationAdmin';
import '../../css/Barber.css';
import WhatsAppButton from '@/Components/Wasa';
import SobreNosotros from '@/Components/Sobrenosotros';
import Footer from '../Components/Footer';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';



export default function PedidosAdmin() {
    const [pedidos, setPedidos] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const pedidosPorPagina = 4;

    const [modalVisible, setModalVisible] = useState(false);
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
    const [filtro, setFiltro] = useState('');

    const [filtroEntrega, setFiltroEntrega] = useState(''); // Para método de entrega
    const [filtroEstado, setFiltroEstado] = useState('');   // Para estado
    const [filtroFecha, setFiltroFecha] = useState('');     // Para fecha seleccionada



    useEffect(() => {
        axios.get('/api/admin/pedidos') // Cambiado a la ruta correcta
            .then(response => {
                if (Array.isArray(response.data)) {
                    setPedidos(response.data);
                } else {
                    setPedidos([]);
                }
            })
            .catch(() => setPedidos([]));
    }, []);


    const pedidosFiltrados = pedidos.filter((pedido) => {
        const cumpleEntrega = filtroEntrega ? pedido.metodo_entrega === filtroEntrega : true;
        const cumpleEstado = filtroEstado ? pedido.estado === filtroEstado : true;
        const cumpleFecha = filtroFecha ? dayjs(pedido.created_at).isSame(filtroFecha, 'day') : true;

        return cumpleEntrega && cumpleEstado && cumpleFecha;
    });

    const indiceUltimoPedido = paginaActual * pedidosPorPagina;
    const indicePrimerPedido = indiceUltimoPedido - pedidosPorPagina;
    const pedidosPaginados = pedidosFiltrados.slice(indicePrimerPedido, indiceUltimoPedido);

    const cambiarPagina = (nuevaPagina) => {
        setPaginaActual(nuevaPagina);
    };

    const actualizarEstadoPedido = (pedidoId, nuevoEstado) => {
        axios
            .patch(`/api/admin/pedidos/${pedidoId}/estado`, { estado: nuevoEstado })
            .then((response) => {
                Swal.fire('¡Éxito!', 'El estado del pedido ha sido actualizado.', 'success');

                // Actualizar el estado en el frontend
                setPedidos((prevPedidos) =>
                    prevPedidos.map((pedido) =>
                        pedido.id === pedidoId ? { ...pedido, estado: nuevoEstado } : pedido
                    )
                );
            })
            .catch((error) => {
                Swal.fire('Error', error.response?.data?.error || 'No se pudo actualizar el estado.', 'error');
            });
    };

    const emitirReembolso = (pedidoId) => {
        axios
            .post(`/api/admin/pedido/${pedidoId}/reembolso`)
            .then((response) => {
                Swal.fire('Reembolso exitoso', response.data.message, 'success');

                // Actualizar la lista de pedidos en el frontend
                setPedidos((prevPedidos) =>
                    prevPedidos.map((pedido) =>
                        pedido.id === pedidoId ? { ...pedido, reembolso_realizado: true } : pedido
                    )
                );
            })
            .catch((error) => {
                Swal.fire('Error', error.response?.data?.error || 'No se pudo procesar el reembolso.', 'error');
            });
    };



    const ordenarPedidos = (filtro) => {
        const pedidosOrdenados = [...pedidos];

        switch (filtro) {
            case 'precioDesc':
                pedidosOrdenados.sort((a, b) => b.total - a.total);
                break;
            case 'precioAsc':
                pedidosOrdenados.sort((a, b) => a.total - b.total);
                break;
            default:
                break;
        }

        setPedidos(pedidosOrdenados);
    };

    
    const handleVerPedido = (pedidoId) => {
        axios.get(`/api/admin/ver-pedido/${pedidoId}`)
            .then(response => {
                setPedidoSeleccionado(response.data);
                setModalVisible(true);
            })
            .catch(() => {
                alert('No se pudo cargar el pedido.');
                setPedidoSeleccionado(null);
            });
    };

    const cerrarModal = () => {
        setModalVisible(false);
        setPedidoSeleccionado(null);
    };

    return (
        <div>
            <NavigationAdmin />

            <div
                className="flex flex-col min-h-screen"
                style={{
                    backgroundImage: `url('/images/barberia.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    justifyContent: 'center',
                }}
            >
                <br /><br /><br />
                <div className="container mx-auto p-6 mt-10 bg-white shadow-md rounded-lg">
                    <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Mis Pedidos 📦</h2>
                    <br /><br />

                    {pedidos.length === 0 ? (
                        <p className="text-center text-gray-500 text-lg">❌ No tienes pedidos registrados.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <div className="mb-4 flex justify-between items-center">
                                <div>


                                    <div className="mb-4 flex flex-wrap gap-4 justify-between items-center">
                                        <div>
                                            <label className="font-bold text-gray-600 mr-2">Ordenar por:</label>
                                            <select
                                                className="border rounded-lg px-4 py-2"
                                                value={filtro}
                                                onChange={(e) => {
                                                    setFiltro(e.target.value);
                                                    ordenarPedidos(e.target.value);
                                                }}
                                            >
                                                <option value="">Seleccionar</option>
                                                <option value="precioDesc">Precio: de mayor a menor</option>
                                                <option value="precioAsc">Precio: de menor a mayor</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="font-bold text-gray-600 mr-2">Método de Entrega:</label>
                                            <select
                                                className="border rounded-lg px-4 py-2"
                                                value={filtroEntrega}
                                                onChange={(e) => setFiltroEntrega(e.target.value)}
                                            >
                                                <option value="">Todos</option>
                                                <option value="recogida">Recogida en tienda</option>
                                                <option value="envio">Envío a domicilio</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="font-bold text-gray-600 mr-2">Estado:</label>
                                            <select
                                                className="border rounded-lg px-4 py-2"
                                                value={filtroEstado}
                                                onChange={(e) => setFiltroEstado(e.target.value)}
                                            >
                                                <option value="">Todos</option>
                                                <option value="pendiente">Pendiente</option>
                                                <option value="enviado">Enviado</option>
                                                <option value="entregado">Entregado</option>
                                                <option value="cancelado">Cancelado</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="font-bold text-gray-600 mr-2">Fecha:</label>
                                            <input
                                                type="date"
                                                className="border rounded-lg px-4 py-2"
                                                value={filtroFecha}
                                                onChange={(e) => setFiltroFecha(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <table className="min-w-full bg-white border border-gray-300 shadow-md">
                                <thead className="bg-gray-800 text-white">
                                    <tr>
                                        <th className="py-2 px-4 border">Número de pedido</th>
                                        <th className="py-2 px-4 border">Email</th>
                                        <th className="py-2 px-4 border">Estado</th>
                                        <th className="py-2 px-4 border">Total</th>
                                        <th className="py-2 px-4 border">Método Entrega</th>
                                        <th className="py-2 px-4 border">Dirección</th>
                                        <th className="py-2 px-4 border">Fecha</th>
                                        <th className="py-2 px-4 border">Acciones</th>
                                        <th className="py-2 px-4 border">Reembolsos</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {pedidosPaginados.map((pedido) => (
                                        <tr key={pedido.id} className="border hover:bg-gray-100">
                                            <td
                                                className="py-2 px-4 text-center font-semibold text-blue-500 cursor-pointer hover:underline"
                                                onClick={() => handleVerPedido(pedido.id)}
                                            >
                                                #{pedido.codigo_pedido}
                                            </td>
                                            <td className="py-2 px-4 text-center">
                {pedido.user?.email || 'No disponible'} {/* Mostrar el email */}
            </td>
                                            <td className={`py-2 px-4 text-center font-semibold
                                                ${pedido.estado === 'pendiente' ? 'text-yellow-500' :
                                                    pedido.estado === 'enviado' ? 'text-blue-500' :
                                                        pedido.estado === 'entregado' ? 'text-green-500' :
                                                            'text-red-500'}`}>
                                                {pedido.estado || 'Desconocido'}
                                            </td>
                                            <td className="py-2 px-4 text-center font-bold">{pedido.total || '0.00'} €</td>
                                            <td className={`py-2 px-4 text-center font-bold
                                                ${pedido.metodo_entrega === 'recogida' ? 'text-blue-500' : 'text-green-500'}`}>
                                                {pedido.metodo_entrega === 'recogida' ? 'Recogida en tienda' : 'Envío a domicilio'}
                                            </td>
                                            <td className="py-2 px-4 text-center">{pedido.direccion_entrega || 'C. Cristóbal Colón, 20, 11540 Sanlúcar de Barrameda, Cádiz'}</td>
                                            <td className="py-2 px-4 text-center font-bold">
                                                {dayjs(pedido.created_at).format('D/M/YYYY')}
                                            </td>
                                            <td className="py-2 px-4 text-center">
    <select
        className="border rounded-lg px-8 py-1 text-sm bg-gray-100"
        value={pedido.estado}
        onChange={(e) => actualizarEstadoPedido(pedido.id, e.target.value)}
    >
        {['pendiente', 'enviado', 'entregado', 'cancelado'].map((estado) => (
            <option key={estado} value={estado}>
                {estado.charAt(0).toUpperCase() + estado.slice(1)}
            </option>
        ))}
    </select>
</td>

<td className="py-2 px-4 text-center">
    {pedido.estado === 'cancelado' ? (
        pedido.reembolso_realizado ? (
            <span className="text-gray-500 italic">Reembolsado</span>
        ) : (
            <button
                onClick={() => emitirReembolso(pedido.id)}
                className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600 transition"
            >
                Reembolsar
            </button>
        )
    ) : (
        <span className="text-gray-500 italic">No disponible</span>
    )}
</td>




                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {pedidos.length > pedidosPorPagina && (
                        <div className="flex justify-center mt-4">
                            {[...Array(Math.ceil(pedidos.length / pedidosPorPagina)).keys()].map((numero) => (
                                <button
                                    key={numero}
                                    onClick={() => cambiarPagina(numero + 1)}
                                    className={`px-4 py-2 mx-1 border rounded-md ${paginaActual === numero + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                                        }`}
                                >
                                    {numero + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {modalVisible && pedidoSeleccionado && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity">
                        <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-3/4 max-w-4xl">
                            {/* Botón para cerrar */}
                            <button
                                onClick={cerrarModal}
                                className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-2xl font-bold transition-colors"
                                aria-label="Cerrar"
                            >
                                ✖
                            </button>

                            {/* Encabezado del modal */}
                            <div className="mb-6">
                                <h3 className="text-3xl font-bold text-center text-gray-800">Detalles del Pedido</h3>
                                <p className="text-center text-gray-500 mt-2">
                                    Pedido #{pedidoSeleccionado.codigo_pedido}
                                </p>
                            </div>

                            {/* Detalles del pedido */}
                            <div className="mb-6">
                                <p className="text-lg">
                                    <strong>Total:</strong> <span className="text-pink-600 font-semibold">{pedidoSeleccionado.total} €</span>
                                </p>
                                <p className="text-lg">
                                    <strong>Estado:</strong> <span className={`font-semibold ${pedidoSeleccionado.estado === 'pendiente' ? 'text-yellow-500' : pedidoSeleccionado.estado === 'enviado' ? 'text-blue-500' : 'text-green-500'}`}>
                                        {pedidoSeleccionado.estado}
                                    </span>
                                </p>
                                <p className="text-lg">
                                    <strong>Método de entrega:</strong> <span className="text-green-600 font-semibold">{pedidoSeleccionado.metodo_entrega} </span>
                                </p>

                                <p className="text-lg">
                                    <strong>Dirección:</strong> {pedidoSeleccionado.direccion_entrega || 'C. Cristóbal Colón, 20, 11540 Sanlúcar de Barrameda, Cádiz'}
                                </p>

                                <p className="text-lg">
                                    <strong>Fecha:</strong> <span className="text-blue-600 font-semibold">
                                        {dayjs(pedidoSeleccionado.fecha).format('D/M/YYYY')}
                                    </span>
                                </p>
                            </div>

                            {/* Lista de productos */}
                            <div>
                                <h4 className="text-xl font-bold mb-4 text-gray-700 border-b pb-2">Productos:</h4>
                                <div className="space-y-4">
                                    {pedidoSeleccionado.productos.map((producto) => (
                                        <div
                                            key={producto.id}
                                            className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-center">
                                                <img
                                                    src={`/storage/${producto.imagen}`}
                                                    alt={producto.nombre}
                                                    className="w-16 h-16 object-cover rounded-lg mr-4"
                                                />
                                                <div>
                                                    <p className="text-lg font-semibold text-gray-800">{producto.nombre}</p>
                                                    <p className="text-sm text-gray-500">Cantidad: {producto.pivot.cantidad}</p>
                                                </div>
                                            </div>
                                            <p className="text-xl font-bold text-gray-700">
                                                {(producto.pivot.cantidad * producto.pivot.precio_unitario).toFixed(2)} €
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                <div className="mt-auto">
                    <SobreNosotros />
                    <Footer />
                    <WhatsAppButton />
                </div>
            </div>
        </div>
    );
}
