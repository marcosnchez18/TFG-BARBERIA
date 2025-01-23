import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';

export default function TrabajadorCitas() {
    const [citas, setCitas] = useState([]);

    useEffect(() => {
        const fechaHoy = dayjs().format('YYYY-MM-DD');

        axios.get(`/trabajador/citas-barbero`)
            .then(response => {
                const citasHoy = response.data.filter(cita =>
                    dayjs(cita.fecha_hora_cita).format('YYYY-MM-DD') === fechaHoy
                );
                setCitas(citasHoy);
            })
            .catch(error => {
                console.error('Error al cargar citas:', error);
            });
    }, []);

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
                axios.delete(`/trabajador/citas/${citaId}/cancelar`)
                    .then(() => {
                        Swal.fire('Cita cancelada', 'La cita ha sido cancelada exitosamente', 'success');
                        setCitas(prevCitas => prevCitas.filter(cita => cita.id !== citaId));
                    })
                    .catch(() => {
                        Swal.fire('Error', 'No se pudo cancelar la cita', 'error');
                    });
            }
        });
    };

    const handleCambiarEstado = (citaId, nuevoEstado) => {
        axios.patch(`/trabajador/citas/${citaId}/cambiar-estado`, { estado: nuevoEstado })
            .then(() => {
                Swal.fire('Estado actualizado', `La cita ha sido marcada como ${nuevoEstado}`, 'success').then(() => {
                    setCitas(prevCitas => prevCitas.map(cita =>
                        cita.id === citaId ? { ...cita, estado: nuevoEstado } : cita
                    ));
                });
            })
            .catch(() => {
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
        <div className="bg-white bg-opacity-80 rounded-lg shadow-lg p-8 w-full max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-center">Citas de Hoy</h1>
            {citas.length > 0 ? (
                <div className="flex flex-col gap-4 mt-6">
                    {citas.map((cita) => {
                        const fecha = new Date(cita.fecha_hora_cita);
                        const mes = fecha.toLocaleString('es-ES', { month: 'long' });
                        const dia = fecha.getDate();
                        const hora = fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                        const año = fecha.getFullYear();

                        return (
                            <div key={cita.id} className="p-6 border rounded-lg shadow bg-white flex flex-col md:flex-row items-center md:justify-between">
                                <div className="text-left w-full md:w-2/3 mb-4 md:mb-0">
                                    <p><strong>Cliente:</strong> {cita.usuario.nombre}</p>
                                    <p><strong>Servicio:</strong> {cita.servicio.nombre}</p>
                                    <p><strong>Estado:</strong> <span className={getEstadoColor(cita.estado)}>{cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}</span></p>
                                    <p><strong>Método de Pago:</strong> {cita.metodo_pago === 'adelantado' ? 'PayPal' : 'Efectivo'}</p>
                                    <p><strong>Precio de la Cita:</strong> {Number(cita.precio_cita || 0).toFixed(2)}€</p>

                                    {cita.estado === 'pendiente' && (
                                        <div className="mt-4 flex gap-2 flex-wrap">
                                            <button
                                                onClick={() => handleCancelarCita(cita.id)}
                                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                                title="Cancelar cita"
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                            <button
                                                onClick={() => handleCambiarEstado(cita.id, 'completada')}
                                                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                                title="Marcar como completada"
                                            >
                                                <i className="fas fa-check"></i>
                                            </button>
                                            <button
                                                onClick={() => handleCambiarEstado(cita.id, 'ausente')}
                                                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                                title="Marcar como ausente"
                                            >
                                                <i className="fas fa-user-slash"></i>
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="text-right w-full md:w-1/3 flex flex-col items-center md:items-end text-lg">
                                    <p>{mes}</p>
                                    <p className="text-4xl font-bold">{dia}</p>
                                    <p>{hora}</p>
                                    <p>{año}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="text-center text-xl text-gray-500">No hay citas programadas para hoy.</p>
            )}
        </div>
    );
}
