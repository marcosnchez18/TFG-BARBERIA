import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import Swal from 'sweetalert2';
import axios from 'axios';
import NavigationCliente from '../Components/NavigationCliente';

export default function MisCitasCliente() {
    // Obtén citas del objeto de props y asegura que citas esté definido por defecto como un array vacío
    const { citas = [] } = usePage().props;

    // Función para cancelar la cita
    const cancelarCita = (id, metodoPago) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas cancelar esta cita?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, cancelar',
            cancelButtonText: 'No, mantener',
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`/citas/${id}/cancelar`)
                    .then((response) => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Cita cancelada exitosamente',
                            text: metodoPago === 'adelantado'
                                ? 'Se ha solicitado la devolución del importe, que será ingresado en tu cuenta de PayPal de 3 a 5 días laborables.'
                                : 'Se ha cancelado su cita, hasta pronto.',
                            showConfirmButton: true,
                        }).then(() => {
                            // Recarga la página después de cerrar la alerta
                            window.location.reload();
                        });
                    })
                    .catch((error) => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: error.response?.data?.error || 'Ocurrió un error al cancelar la cita',
                        });
                    });
            }
        });
    };

    // Función para obtener la imagen del barbero según el ID
    const obtenerImagenBarbero = (barberoId) => {
        switch (barberoId) {
            case 1:
                return "/images/jose.png";
            case 2:
                return "/images/hector.png";
            default:
                return "/images/default.png"; // Imagen por defecto en caso de no coincidir con los IDs
        }
    };

    return (
        <div>
            <NavigationCliente />
            <div className="container mx-auto p-8">
                <h1 className="text-4xl font-bold mb-6">Mis Citas</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {citas.length > 0 ? (
                        citas.map((cita) => (
                            <div key={cita.id} className="p-6 border rounded-lg shadow bg-white">
                                <div className="flex items-center mb-4">
                                    <img
                                        src={obtenerImagenBarbero(cita.barbero.id)}
                                        alt={cita.barbero.nombre}
                                        className="w-16 h-16 rounded-full mr-4"
                                    />
                                    <div>
                                        <p className="text-lg font-semibold">{cita.barbero.nombre}</p>
                                        <p className="text-gray-500">{cita.servicio.nombre}</p>
                                    </div>
                                </div>
                                <p><strong>Fecha y Hora:</strong> {cita.fecha_hora_cita}</p>
                                <p>
                                    <strong>Método de Pago:</strong>{' '}
                                    {cita.metodo_pago === 'adelantado' ? 'PayPal' : 'Efectivo'}
                                </p>
                                <p>
                                    <strong>Estado:</strong> {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
                                </p>
                                <button
                                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                    onClick={() => cancelarCita(cita.id, cita.metodo_pago)}
                                >
                                    Cancelar Cita
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-xl text-center">No tienes citas programadas.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
