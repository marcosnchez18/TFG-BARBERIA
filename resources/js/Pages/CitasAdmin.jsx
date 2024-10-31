import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import Swal from 'sweetalert2';
import axios from 'axios';
import NavigationAdmin from '../Components/NavigationAdmin';
import SobreNosotros from '@/Components/Sobrenosotros';
import Footer from '../Components/Footer';

export default function CitasAdmin() {
    const [citas, setCitas] = useState([]);

    useEffect(() => {
        axios.get('/admin/citas-barbero')
            .then(response => {
                setCitas(response.data);
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
                axios.delete(`/admin/citas/${citaId}/cancelar`)
                    .then(() => {
                        Swal.fire('Cita cancelada', 'La cita ha sido cancelada exitosamente', 'success');
                        setCitas(prevCitas => prevCitas.filter(cita => cita.id !== citaId));
                    })
                    .catch(error => {
                        Swal.fire('Error', 'No se pudo cancelar la cita', 'error');
                    });
            }
        });
    };

    const handleCambiarEstado = (citaId, nuevoEstado) => {
        axios.patch(`/admin/citas/${citaId}/cambiar-estado`, { estado: nuevoEstado })
            .then(() => {
                Swal.fire('Estado actualizado', `La cita ha sido marcada como ${nuevoEstado}`, 'success').then(() => {
                    // Recarga la página después de confirmar el cambio de estado
                    window.location.reload();
                });
            })
            .catch(error => {
                Swal.fire('Error', 'No se pudo actualizar el estado de la cita', 'error');
            });
    };


    return (
        <div>
            <NavigationAdmin />
            <div className="container mx-auto p-8 text-center">
                <h1 className="text-4xl font-bold mb-6">Próximas Citas</h1>
                {citas.length > 0 ? (
                    <div className="flex flex-col gap-4 mt-6 items-center">
                        {citas.map((cita) => {
                            const fecha = new Date(cita.fecha_hora_cita);
                            const mes = fecha.toLocaleString('es-ES', { month: 'long' });
                            const dia = fecha.getDate();
                            const hora = fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                            const año = fecha.getFullYear();

                            return (
                                <div key={cita.id} className="p-6 border rounded-lg shadow bg-white flex items-center justify-between max-w-lg w-full">
                                    <div className="text-left w-2/3">
                                        <p><strong>Cliente:</strong> {cita.usuario.nombre}</p>
                                        <p><strong>Servicio:</strong> {cita.servicio.nombre}</p>
                                        <p><strong>Estado:</strong> {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}</p>
                                        <p><strong>Método de Pago:</strong> {cita.metodo_pago === 'adelantado' ? 'PayPal' : 'Efectivo'}</p>
                                        <div className="mt-4 flex gap-2">
                                            <button
                                                onClick={() => handleCancelarCita(cita.id)}
                                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                            >
                                                Cancelar Cita
                                            </button>
                                            <button
                                                onClick={() => handleCambiarEstado(cita.id, 'completada')}
                                                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                            >
                                                Completada
                                            </button>
                                            <button
                                                onClick={() => handleCambiarEstado(cita.id, 'ausente')}
                                                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                            >
                                                Ausente
                                            </button>
                                        </div>
                                    </div>
                                    <div className="text-right w-1/3 flex flex-col items-center" style={{ color: '#D2B48C' }}>
                                        <p className="text-xl text-center">{mes}</p>
                                        <p className="text-5xl font-bold mt-[-8px]">{dia}</p>
                                        <p className="text-lg">{hora}</p>
                                        <p className="text-lg">{año}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-center text-xl text-gray-500">No hay citas programadas.</p>
                )}
            </div>
            <SobreNosotros />
            <Footer />
        </div>
    );
}
