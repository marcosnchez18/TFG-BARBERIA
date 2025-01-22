import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import NavigationAdmin from '../../Components/NavigationAdmin';
import SobreNosotros from '@/Components/Sobrenosotros';
import Footer from '../../Components/Footer';

export default function CitasBarberia() {
    const [citas, setCitas] = useState([]);
    const [barberos, setBarberos] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [filtros, setFiltros] = useState({
        barbero_id: '',
        servicio_id: '',
        estado: '',
        fecha_dia: '',
        fecha_mes: '',
    });

    useEffect(() => {
        cargarDatosIniciales();
        cargarCitas();
    }, []);

    const cargarDatosIniciales = () => {
        // Cargar datos de barberos y servicios para los filtros
        axios.get('/api/barberos').then((res) => setBarberos(res.data));
        axios.get('/api/servicios').then((res) => setServicios(res.data));

    };

    const cargarCitas = () => {
        // Cargar citas con filtros
        axios
            .get(`/admin/citas-barberia`, { params: filtros })
            .then((response) => setCitas(response.data))
            .catch((error) => {
                console.error('Error al cargar citas:', error);
            });
    };

    const handleCambiarMetodoPago = (citaId, nuevoMetodo) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Deseas cambiar el método de pago a ${nuevoMetodo}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, cambiar',
            cancelButtonText: 'No, mantener',
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .patch(`/admin/citas/${citaId}/cambiar-metodo-pago`, { metodo_pago: nuevoMetodo })
                    .then(() => {
                        Swal.fire('Método de pago actualizado', `El método de pago ha sido cambiado a ${nuevoMetodo}`, 'success').then(() => {
                            cargarCitas();
                        });
                    })
                    .catch((error) => {
                        Swal.fire('Error', 'No se pudo actualizar el método de pago', 'error');
                    });
            }
        });
    };


    const handleFiltroChange = (e) => {
        setFiltros({
            ...filtros,
            [e.target.name]: e.target.value,
        });
    };
    const limpiarFiltros = () => {
        setFiltros({
            barbero_id: '',
            servicio_id: '',
            estado: '',
            fecha_dia: '',
            fecha_mes: '',
        });
        cargarCitas();
    };

    const aplicarFiltros = () => {
        cargarCitas();
    };

    const handleCancelarCita = (citaId) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas cancelar esta cita?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, cancelar',
            cancelButtonText: 'No, mantener',
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`/admin/citas/${citaId}/cancelar`)
                    .then(() => {
                        Swal.fire('Cita cancelada', 'La cita ha sido cancelada exitosamente', 'success');
                        setCitas((prevCitas) => prevCitas.filter((cita) => cita.id !== citaId));
                    })
                    .catch((error) => {
                        Swal.fire('Error', 'No se pudo cancelar la cita', 'error');
                    });
            }
        });
    };

    const handleCambiarEstado = (citaId, nuevoEstado) => {
        axios.patch(`/admin/citas/${citaId}/cambiar-estado`, { estado: nuevoEstado })
            .then(() => {
                Swal.fire('Estado actualizado', `La cita ha sido marcada como ${nuevoEstado}`, 'success').then(() => {
                    cargarCitas();
                });
            })
            .catch((error) => {
                Swal.fire('Error', 'No se pudo actualizar el estado de la cita', 'error');
            });
    };

    const getEstadoColor = (estado) => {
        switch (estado) {
            case 'pendiente':
                return 'text-blue-500';
            case 'ausente':
                return 'text-red-500';
            case 'completada':
                return 'text-green-500';
            default:
                return 'text-gray-500';
        }
    };

    return (
        <div
            className="admin-dashboard bg-cover bg-center min-h-screen"
            style={{
                backgroundImage: `url('/images/barberia.jpg')`,
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed',
            }}
        >
            <NavigationAdmin />
            <div className="container mx-auto py-12">
                <div className="bg-white bg-opacity-80 rounded-lg shadow-lg p-8 w-full max-w-5xl mx-auto">
                    <h1 className="text-4xl font-bold mb-6 text-center">Gestión de Citas</h1>

                    {/* Filtros */}
                    <div className="mb-4 flex flex-wrap justify-between items-center gap-4">
                        <select
                            name="barbero_id"
                            value={filtros.barbero_id}
                            onChange={handleFiltroChange}
                            className="border p-2 rounded flex-grow"
                        >
                            <option value="">Todos los Barberos</option>
                            {barberos.map((barbero) => (
                                <option key={barbero.id} value={barbero.id}>
                                    {barbero.nombre}
                                </option>
                            ))}
                        </select>

                        <select
                            name="servicio_id"
                            value={filtros.servicio_id}
                            onChange={handleFiltroChange}
                            className="border p-2 rounded flex-grow"
                        >
                            <option value="">Todos los Servicios</option>
                            {servicios.map((servicio) => (
                                <option key={servicio.id} value={servicio.id}>
                                    {servicio.nombre}
                                </option>
                            ))}
                        </select>

                        <select
                            name="estado"
                            value={filtros.estado}
                            onChange={handleFiltroChange}
                            className="border p-2 rounded flex-grow"
                        >
                            <option value="">Todos los Estados</option>
                            <option value="pendiente">Pendiente</option>
                            <option value="completada">Completada</option>
                            <option value="ausente">Ausente</option>
                        </select>

                        <input
                            type="date"
                            name="fecha_dia"
                            value={filtros.fecha_dia}
                            onChange={handleFiltroChange}
                            className="border p-2 rounded flex-grow"
                        />

                        <input
                            type="month"
                            name="fecha_mes"
                            value={filtros.fecha_mes}
                            onChange={handleFiltroChange}
                            className="border p-2 rounded flex-grow"
                        />
                    </div>
                    <div className="flex justify-center gap-4 mb-6">
                        <button
                            onClick={aplicarFiltros}
                            className="bg-blue-500 text-white px-6 py-2 rounded"
                        >
                            Aplicar Filtros
                        </button>
                        <button
                            onClick={limpiarFiltros}
                            className="bg-gray-500 text-white px-6 py-2 rounded"
                        >
                            Limpiar Filtros
                        </button>
                    </div>



                    {/* Listado de Citas */}
                    {citas.length > 0 ? (
                        <div className="flex flex-col gap-4">
                            {citas.map((cita) => {
                                const fecha = new Date(cita.fecha_hora_cita);
                                const mes = fecha.toLocaleString('es-ES', { month: 'long' });
                                const dia = fecha.getDate();
                                const hora = fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                                const año = fecha.getFullYear();

                                return (
                                    <div key={cita.id} className="p-6 border rounded-lg shadow bg-white">
                                        <p><strong>Barbero:</strong> {cita.barbero.nombre}</p>
                                        <p><strong>Cliente:</strong> {cita.usuario.nombre}</p>
                                        <p><strong>Servicio:</strong> {cita.servicio.nombre}</p>
                                        <p><strong>Estado:</strong> <span className={getEstadoColor(cita.estado)}>{cita.estado}</span></p>
                                        <p><strong>Fecha:</strong> {`${dia} ${mes} ${año}, ${hora}`}</p>
                                        <p>
                                            <strong>Método de Pago:</strong>{' '}
                                            {cita.metodo_pago === 'efectivo'
                                                ? 'Efectivo'
                                                : cita.metodo_pago === 'tarjeta'
                                                    ? 'Tarjeta'
                                                    : 'PayPal'}
                                        </p>

                                        <p><strong>Precio:</strong> {cita.precio_cita}€</p>

                                        {/* Acciones */}
                                        {cita.estado === 'pendiente' && (
                                            <div className="mt-4 flex gap-2">
                                                <button
                                                    onClick={() => handleCancelarCita(cita.id)}
                                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    onClick={() => handleCambiarEstado(cita.id, 'completada')}
                                                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                                >
                                                    Marcar Completada
                                                </button>
                                                <button
                                                    onClick={() => handleCambiarEstado(cita.id, 'ausente')}
                                                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                                >
                                                    Marcar Ausente
                                                </button>
                                            </div>
                                        )}

                                        {/* Botón para Cambiar Método de Pago */}
                                        {cita.metodo_pago === 'efectivo' && (
                                            <div className="mt-4">
                                                <button
                                                    onClick={() => handleCambiarMetodoPago(cita.id, 'tarjeta')}
                                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                >
                                                    Pago con tarjeta   💳
                                                </button>
                                            </div>
                                        )}
                                        {cita.metodo_pago === 'tarjeta' && (
                                            <div className="mt-4">
                                                <button
                                                    onClick={() => handleCambiarMetodoPago(cita.id, 'efectivo')}
                                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                >
                                                    Pago Efectivo   🪙
                                                </button>
                                            </div>
                                        )}

                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-center text-xl text-gray-500">No se encontraron citas con los filtros seleccionados.</p>
                    )}
                </div>
            </div>
            <SobreNosotros />
            <Footer />
        </div>
    );
}
