import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavigationCliente from '../Components/NavigationCliente';
import '../../css/Barber.css';
import WhatsAppButton from '@/Components/Wasa';
import SobreNosotros from '@/Components/Sobrenosotros';
import Footer from '../Components/Footer';

export default function MisPedidos() {
    const [pedidos, setPedidos] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const pedidosPorPagina = 4;

    useEffect(() => {
        axios.get('/api/mis-pedidos')
            .then(response => {
                console.log("Pedidos recibidos:", response.data); // Log para depuración
                if (Array.isArray(response.data)) {
                    setPedidos(response.data);
                } else {
                    setPedidos([]); // Evita fallos si la API devuelve un formato inesperado
                }
            })
            .catch(error => {
                console.error("Error al obtener los pedidos:", error);
                setPedidos([]);
            });
    }, []);

    // Calcular los pedidos a mostrar en la página actual
    const indiceUltimoPedido = paginaActual * pedidosPorPagina;
    const indicePrimerPedido = indiceUltimoPedido - pedidosPorPagina;
    const pedidosPaginados = pedidos.slice(indicePrimerPedido, indiceUltimoPedido);

    // Cambiar de página
    const cambiarPagina = (nuevaPagina) => {
        setPaginaActual(nuevaPagina);
    };

    return (
        <div>
            <NavigationCliente />
            <div
                className="flex flex-col min-h-screen"
                style={{
                    backgroundImage: `url('/images/barberia.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    justifyContent: 'center',
                }}
            >
                <div className="container mx-auto p-6 mt-10 bg-white shadow-md rounded-lg">
                    <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Mis Pedidos 📦</h2>

                    {pedidos.length === 0 ? (
                        <p className="text-center text-gray-500 text-lg">❌ No tienes pedidos registrados.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-300 shadow-md">
                                <thead className="bg-gray-800 text-white">
                                    <tr>
                                        <th className="py-2 px-4 border">ID</th>
                                        <th className="py-2 px-4 border">Estado</th>
                                        <th className="py-2 px-4 border">Total</th>
                                        <th className="py-2 px-4 border">Método Entrega</th>
                                        <th className="py-2 px-4 border">Dirección</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pedidosPaginados.map((pedido) => (
                                        <tr key={pedido.id} className="border hover:bg-gray-100">
                                            <td className="py-2 px-4 text-center font-semibold">#{pedido.codigo_pedido}</td>

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
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Paginación */}
                    {pedidos.length > pedidosPorPagina && (
                        <div className="flex justify-center mt-4">
                            {[...Array(Math.ceil(pedidos.length / pedidosPorPagina)).keys()].map((numero) => (
                                <button
                                    key={numero}
                                    onClick={() => cambiarPagina(numero + 1)}
                                    className={`px-4 py-2 mx-1 border rounded-md ${
                                        paginaActual === numero + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                                    }`}
                                >
                                    {numero + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-auto">
                    <SobreNosotros />
                    <Footer />
                    <WhatsAppButton />
                </div>
            </div>
        </div>
    );
}
