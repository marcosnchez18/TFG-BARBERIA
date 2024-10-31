import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import NavigationAdmin from '../Components/NavigationAdmin';
import SobreNosotros from '@/Components/Sobrenosotros';
import Footer from '../Components/Footer';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function AdminDashboard() {
    const { user, citasHoy, nuevosUsuariosHoy, gananciasMes, nombreMesActual, valoracionMedia } = usePage().props;
    const [selectedDate, setSelectedDate] = useState(null);
    const [citasDia, setCitasDia] = useState([]);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        const formattedDate = dayjs(date).format('YYYY-MM-DD');

        axios.get(`/admin/citas/${formattedDate}`)
            .then(response => {
                setCitasDia(response.data);
            })
            .catch(() => {
                setCitasDia([]);
            });
    };

    const handleCancelarCita = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas cancelar esta cita?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, cancelar',
            cancelButtonText: 'No, mantener',
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`/admin/citas/${id}/cancelar`)
                    .then(() => {
                        Swal.fire('Cita cancelada', 'La cita ha sido cancelada exitosamente', 'success');
                        setCitasDia(prevCitas => prevCitas.filter(cita => cita.id !== id));
                    })
                    .catch(() => {
                        Swal.fire('Error', 'No se pudo cancelar la cita', 'error');
                    });
            }
        });
    };

    const handleCambiarEstado = (id, estado) => {
        axios.patch(`/admin/citas/${id}/cambiar-estado`, { estado })
            .then(() => {
                Swal.fire('Estado actualizado', `La cita ha sido marcada como ${estado}`, 'success');
                setCitasDia(prevCitas => prevCitas.map(cita =>
                    cita.id === id ? { ...cita, estado } : cita
                ));
            })
            .catch(() => {
                Swal.fire('Error', 'No se pudo actualizar el estado de la cita', 'error');
            });
    };

    const getEstadoClass = (estado) => {
        switch (estado) {
            case 'completada':
                return 'text-green-500';
            case 'pendiente':
                return 'text-blue-500';
            case 'ausente':
                return 'text-red-500';
            default:
                return 'text-gray-500';
        }
    };

    return (
        <div className="admin-dashboard bg-gray-100 min-h-screen">
            <NavigationAdmin admin={true} />

            <div className="container mx-auto mt-12 p-8 bg-white rounded-lg shadow-lg">
                <header className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-[#A87B43]">¡Bienvenido de Nuevo, {user.nombre}!</h1>
                    <p className="text-lg text-gray-600 mt-2">Panel de Control del Administrador</p>
                </header>

                {/* Estadísticas rápidas y calendario */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Estadísticas rápidas */}
                    <div className="bg-gray-50 rounded-lg p-6 shadow-md">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Estadísticas Rápidas</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="stat bg-[#F7ECE3] p-4 rounded-lg text-center">
                                <p className="text-xl font-semibold text-[#A87B43]">Citas Hoy</p>
                                <span className="text-3xl font-bold">{citasHoy}</span>
                            </div>
                            <div className="stat bg-[#E7F3F3] p-4 rounded-lg text-center">
                                <p className="text-xl font-semibold text-[#4A7A7C]">Nuevos Usuarios</p>
                                <span className="text-3xl font-bold">{nuevosUsuariosHoy}</span>
                            </div>
                            <div className="stat bg-[#EFE3F0] p-4 rounded-lg text-center">
                                <p className="text-xl font-semibold text-[#A87B43]">Ganancias de {nombreMesActual}</p>
                                <span className="text-3xl font-bold">€{gananciasMes}</span>
                            </div>
                            <div className="stat bg-[#F3F1E4] p-4 rounded-lg text-center">
                                <p className="text-xl font-semibold text-[#A87B43]">Valoración media</p>
                                <span className="text-3xl font-bold">{valoracionMedia ? Math.round(valoracionMedia) : 'N/A'} ⭐</span>
                            </div>
                        </div>
                    </div>

                    {/* Calendario y citas del día */}
                    <div className="calendar-section mt-8">
                        <h2 className="text-3xl font-semibold text-[#A87B43] mb-6 text-center">Calendario de Citas</h2>
                        <div className="flex justify-center">
                            <Calendar
                                onChange={handleDateChange}
                                value={selectedDate}
                                minDate={new Date()}
                                className="w-full max-w-md mx-auto"
                            />
                        </div>
                        <div className="citas-list mt-6">
                            <h3 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
                                {selectedDate ? `Citas para el ${dayjs(selectedDate).format('DD MMMM YYYY')}` : 'Selecciona una fecha'}
                            </h3>
                            {citasDia.length > 0 ? (
                                <ul className="space-y-4">
                                    {citasDia.map(cita => (
                                        <li key={cita.id} className="p-4 border rounded-lg bg-gray-50 shadow-md">
                                            <p><strong>Cliente:</strong> {cita.usuario.nombre}</p>
                                            <p><strong>Servicio:</strong> {cita.servicio.nombre}</p>
                                            <p><strong>Hora:</strong> {dayjs(cita.fecha_hora_cita).format('HH:mm')}</p>
                                            <p><strong>Estado:</strong> <span className={getEstadoClass(cita.estado)}>{cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}</span></p>
                                            {cita.estado === 'pendiente' && (
                                                <div className="mt-4 flex space-x-2">
                                                    <button
                                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                                        onClick={() => handleCancelarCita(cita.id)}
                                                    >
                                                        Cancelar Cita
                                                    </button>
                                                    <button
                                                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                                        onClick={() => handleCambiarEstado(cita.id, 'completada')}
                                                    >
                                                        Completada
                                                    </button>
                                                    <button
                                                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                                        onClick={() => handleCambiarEstado(cita.id, 'ausente')}
                                                    >
                                                        Ausente
                                                    </button>
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-center text-red-500 italic">No hay citas para este día.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <SobreNosotros />
            <Footer />
        </div>
    );
}
