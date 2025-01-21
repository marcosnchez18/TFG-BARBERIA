import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavigationAdmin from '../Components/NavigationAdmin';
import Footer from '../Components/Footer';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import SobreNosotros from '@/Components/Sobrenosotros';

export default function PedidosInventario() {
    const [pedidos, setPedidos] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const pedidosPorPagina = 4;
    const [filtroEstado, setFiltroEstado] = useState('');
    const [filtroFecha, setFiltroFecha] = useState('');

    const añadirStock = (codigo_pedido) => {
        axios.post(`/admin/pedidos-proveedores/${codigo_pedido}/añadir-stock`)
            .then(response => {
                Swal.fire('¡Stock actualizado!', response.data.message, 'success');

                // Actualizar el estado de todos los pedidos con el mismo codigo_pedido
                setPedidos(prevPedidos =>
                    prevPedidos.map(pedido =>
                        pedido.codigo_pedido === codigo_pedido
                            ? { ...pedido, stock_añadido: true } //ocultar el boton
                            : pedido
                    )
                );
            })
            .catch(error => {
                Swal.fire('Error', error.response?.data?.message || 'No se pudo añadir el stock.', 'error');
            });
    };




    useEffect(() => {
        axios.get('/admin/pedidos-proveedores')
            .then(response => {
                if (Array.isArray(response.data)) {
                    agruparPedidos(response.data);
                } else {
                    setPedidos([]);
                }
            })
            .catch(error => {
                console.error("Error al obtener pedidos de proveedores:", error);
                setPedidos([]);
            });
    }, []);



    // Agrupar pedidos por codigo_pedido
    const agruparPedidos = (pedidos) => {
        const pedidosAgrupados = pedidos.reduce((acc, pedido) => {
            const { codigo_pedido } = pedido;
            if (!acc[codigo_pedido]) {
                acc[codigo_pedido] = {
                    codigo_pedido,
                    estado: pedido.estado,
                    proveedor: pedido.proveedor,
                    fecha: pedido.created_at,
                    stock_añadido: pedido.stock_añadido,
                    productos: [],
                    total: 0 // Inicializar el total
                };
            }

            // Agregar productos y sumar el total del pedido
            const totalProducto = pedido.cantidad * pedido.producto.precio_proveedor;
            acc[codigo_pedido].productos.push({
                id: pedido.producto.id,
                nombre: pedido.producto.nombre,
                cantidad: pedido.cantidad,
                precio_unitario: pedido.producto.precio_proveedor,
                imagen: pedido.producto.imagen
            });

            acc[codigo_pedido].total += totalProducto; // Sumar al total del pedido

            return acc;
        }, {});

        setPedidos(Object.values(pedidosAgrupados));
    };



    // Aplicar filtros antes de paginar
    const pedidosFiltrados = pedidos.filter(pedido => {
        const cumpleEstado = filtroEstado ? pedido.estado === filtroEstado : true;
        const cumpleFecha = filtroFecha ? dayjs(pedido.fecha).isSame(filtroFecha, 'day') : true;
        return cumpleEstado && cumpleFecha;
    });

    // Paginación
    const totalPaginas = Math.ceil(pedidosFiltrados.length / pedidosPorPagina);
    const indiceUltimoPedido = paginaActual * pedidosPorPagina;
    const indicePrimerPedido = indiceUltimoPedido - pedidosPorPagina;
    const pedidosPaginados = pedidosFiltrados.slice(indicePrimerPedido, indiceUltimoPedido);

    const cambiarPagina = (nuevaPagina) => {
        if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
            setPaginaActual(nuevaPagina);
        }
    };

    // Actualizar estado del pedido
    const actualizarEstadoPedido = (codigo_pedido, nuevoEstado) => {
        axios.patch(`/admin/pedidos-proveedores/${codigo_pedido}/estado`, { estado: nuevoEstado })
            .then(() => {
                Swal.fire('¡Éxito!', 'El estado del pedido ha sido actualizado.', 'success');
                setPedidos(prevPedidos =>
                    prevPedidos.map(pedido =>
                        pedido.codigo_pedido === codigo_pedido ? { ...pedido, estado: nuevoEstado } : pedido
                    )
                );
            })
            .catch(() => {
                Swal.fire('Error', 'No se pudo actualizar el estado del pedido.', 'error');
            });
    };


    return (
        <div
            className="admin-dashboard min-h-screen bg-cover bg-center"
            style={{
                backgroundImage: `url('/images/barberia.jpg')`,
                backgroundAttachment: 'fixed',
            }}
        >
            <NavigationAdmin />

            <div className="container mx-auto p-8">
                <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg w-full max-w-6xl mx-auto mt-12 relative">
                    <h2 className="text-4xl font-extrabold text-center text-[#000000] mb-6">
                        Pedidos de Inventario 📦
                    </h2>

                    {/* Filtros */}
                    <div className="flex flex-wrap gap-4 mb-4">
                        {/* Filtro por estado */}
                        <div>
                            <label className="font-bold text-gray-600 mr-2">Filtrar por Estado:</label>
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

                        {/* Filtro por fecha */}
                        <div>
                            <label className="font-bold text-gray-600 mr-2">Filtrar por Fecha:</label>
                            <input
                                type="date"
                                className="border rounded-lg px-4 py-2"
                                value={filtroFecha}
                                onChange={(e) => setFiltroFecha(e.target.value)}
                            />
                        </div>
                    </div>

                    {pedidos.length === 0 ? (
                        <p className="text-center text-gray-500 text-lg">
                            ❌ No hay pedidos en el inventario.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-300 shadow-md">
                                <thead className="bg-gray-800 text-white">
                                    <tr>
                                        <th className="py-2 px-4 border">Código Pedido</th>
                                        <th className="py-2 px-4 border">Proveedor</th>
                                        <th className="py-2 px-4 border">Estado</th>
                                        <th className="py-2 px-4 border">Fecha</th>
                                        <th className="py-2 px-4 border">Total (€)</th>
                                        <th className="py-2 px-4 border">Productos</th>
                                        <th className="py-2 px-4 border">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pedidosPaginados.map((pedido) => (
                                        <tr key={pedido.codigo_pedido} className="border hover:bg-gray-100">
                                            <td className="py-2 px-4 text-center font-semibold text-blue-500">
                                                #{pedido.codigo_pedido}
                                            </td>
                                            <td className="py-2 px-4 text-center">
                                                {pedido.proveedor?.nombre || 'Desconocido'}
                                            </td>

                                            <td className={`py-2 px-4 text-center font-semibold ${pedido.estado === 'pendiente' ? 'text-yellow-500' :
                                                    pedido.estado === 'enviado' ? 'text-blue-500' :
                                                        pedido.estado === 'entregado' ? 'text-green-500' :
                                                            pedido.estado === 'cancelado' ? 'text-red-500' :
                                                                'text-gray-500' // Color por defecto si no coincide con ninguno
                                                }`}>
                                                {pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}
                                            </td>



                                            <td className="py-2 px-4 text-center">
                                                {dayjs(pedido.fecha).format('D/M/YYYY')}
                                            </td>
                                            <td className="py-2 px-4 text-center font-bold text-gray-800">
                                                {pedido.total.toFixed(2)} €
                                            </td>
                                            <td className="py-2 px-4">
                                                {pedido.productos.map(producto => (
                                                    <div key={producto.id} className="flex items-center space-x-3">
                                                        <img
                                                            src={`/storage/${producto.imagen}`}
                                                            alt={producto.nombre}
                                                            className="w-12 h-12 object-cover rounded-lg"
                                                        />
                                                        <div>
                                                            <p className="text-sm font-semibold">{producto.nombre}</p>
                                                            <p className="text-xs text-gray-600">
                                                                {producto.cantidad} unidades | {(producto.precio_unitario * producto.cantidad).toFixed(2)} €
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </td>
                                            <td className="py-2 px-4 text-center">
                                                <select
                                                    className="border rounded-lg px-8 py-1 text-sm bg-gray-100"
                                                    value={pedido.estado}
                                                    onChange={(e) => actualizarEstadoPedido(pedido.codigo_pedido, e.target.value)}
                                                >
                                                    {['pendiente', 'enviado', 'entregado', 'cancelado'].map((estado) => (
                                                        <option key={estado} value={estado}>
                                                            {estado.charAt(0).toUpperCase() + estado.slice(1)}
                                                        </option>
                                                    ))}
                                                </select>

                                                {pedido.estado === 'entregado' && !pedido.stock_añadido && (
                                                    <button
                                                        onClick={() => añadirStock(pedido.codigo_pedido)}
                                                        className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                                                    >
                                                        Añadir Stock
                                                    </button>
                                                )}



                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Paginación */}
                    {totalPaginas > 1 && (
                        <div className="flex justify-center mt-6">
                            <button className="px-4 py-2 mx-2 border rounded-md bg-gray-200 text-gray-800"
                                onClick={() => cambiarPagina(paginaActual - 1)}
                                disabled={paginaActual === 1}>
                                ⬅ Anterior
                            </button>
                            <span className="px-4 py-2 font-bold">Página {paginaActual} de {totalPaginas}</span>
                            <button className="px-4 py-2 mx-2 border rounded-md bg-gray-200 text-gray-800"
                                onClick={() => cambiarPagina(paginaActual + 1)}
                                disabled={paginaActual === totalPaginas}>
                                Siguiente ➡
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <SobreNosotros />
            <Footer />
        </div>
    );
}
