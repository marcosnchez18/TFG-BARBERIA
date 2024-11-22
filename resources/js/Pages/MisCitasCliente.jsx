
import { usePage } from '@inertiajs/react';
import Swal from 'sweetalert2';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import Holidays from 'date-holidays';
import NavigationCliente from '../Components/NavigationCliente';
import WhatsAppButton from '@/Components/Wasa';
import SobreNosotros from '../Components/Sobrenosotros';
import Footer from '../Components/Footer';
import isBetween from 'dayjs/plugin/isBetween';

// Extender dayjs con el plugin
dayjs.extend(isBetween);


dayjs.locale('es');

export default function MisCitasCliente() {
    const { citas = [], servicios = [] } = usePage().props;
    const [showModificar, setShowModificar] = useState(false);
    const [selectedCita, setSelectedCita] = useState(null);
    const [selectedServicio, setSelectedServicio] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [horariosDisponibles, setHorariosDisponibles] = useState([]);
    const today = dayjs().startOf('day');
    const holidays = new Holidays('ES', 'AN', 'CA');
    const [logoBase64, setLogoBase64] = useState('');
    const [qrBase64, setQrBase64] = useState('');



    useEffect(() => {
        fetch('/images/ruloo.jpg')
            .then(response => response.blob())
            .then(blob => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setLogoBase64(reader.result); // Logo en base64
                };
                reader.readAsDataURL(blob);
            })
            .catch(error => console.error("Error al cargar el logo:", error));


        fetch('/images/qr.png')
            .then(response => response.blob())
            .then(blob => {
                const reader = new FileReader();
                reader.onloadend = () => setQrBase64(reader.result);
                reader.readAsDataURL(blob);
            })
            .catch(error => console.error("Error al cargar el QR:", error));
    }, []);


    const citasOrdenadas = citas
        .filter(cita => dayjs(cita.fecha_hora_cita).isAfter(today) && cita.estado === 'pendiente')
        .sort((a, b) => new Date(a.fecha_hora_cita) - new Date(b.fecha_hora_cita));

    const citasCompletadas = citas
        .filter(cita =>
            cita.estado === 'completada' ||
            cita.estado === 'ausente' ||
            dayjs(cita.fecha_hora_cita).isBefore(today)
        )
        .sort((a, b) => new Date(a.fecha_hora_cita) - new Date(b.fecha_hora_cita));

    const getEstadoClass = (estado) => {
        switch (estado) {
            case 'pendiente':
                return 'text-blue-500';
            case 'completada':
                return 'text-green-500';
            case 'ausente':
                return 'text-red-500';
            default:
                return 'text-gray-500';
        }
    };

    const cancelarCita = (id, metodoPago) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas cancelar esta cita? Si es así, ¿puedes darnos una breve explicación?',
            input: 'textarea',
            inputPlaceholder: 'Escribe tu explicación aquí...',
            showCancelButton: true,
            confirmButtonText: 'Sí, cancelar',
            cancelButtonText: 'No, mantener',
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`/citas/${id}/cancelar`, {
                        data: { mensajeExplicacion: result.value }
                    })
                    .then(() => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Cita cancelada exitosamente',
                            text: metodoPago === 'adelantado'
                                ? 'Se ha solicitado la devolución del importe, que será ingresado en tu cuenta de PayPal de 3 a 5 días laborables.'
                                : 'Se ha cancelado su cita, hasta pronto.',
                            showConfirmButton: true,
                        }).then(() => {
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

    const handleModifyClick = (cita) => {
        setSelectedCita(cita);
        setSelectedServicio(cita.servicio);
        setShowModificar(true);
    };

    const handleDayClick = (date) => {
        const dayOfWeek = dayjs(date).day(); // Día de la semana
        const isHoliday = holidays.isHoliday(dayjs(date).format('YYYY-MM-DD')); // Verifica si es festivo

        // Mostrar advertencia y bloquear selección para domingos y festivos
        if (dayOfWeek === 0 || isHoliday) {
            Swal.fire({
                icon: 'warning',
                title: 'Día no disponible',
                text: 'No puedes seleccionar domingos o días festivos.',
            });
            setSelectedDate(null); // Limpia la fecha seleccionada
            setHorariosDisponibles([]); // Limpia horarios disponibles
            return;
        }

        handleSelectDate(date); // Permite seleccionar días válidos
    };


    const handleSelectServicio = (servicio) => {
        setSelectedServicio(servicio);
    };

    const handleSelectDate = (date) => {
        setSelectedDate(date);
        const formattedDate = dayjs(date).format('YYYY-MM-DD');

        axios.get(`/api/citas/disponibilidad`, {
            params: {
                fecha: formattedDate,
                barbero_id: selectedCita.barbero.id,
                servicio_id: selectedServicio.id,
            },
        })
        .then((response) => {
            // Asegúrate de que la respuesta sea un array de horarios
            if (Array.isArray(response.data)) {
                setHorariosDisponibles(response.data);
            } else {
                setHorariosDisponibles([]);
            }
        })
        .catch((error) => {
            console.error("Error al obtener disponibilidad:", error);
            Swal.fire('Error', 'No se pudo obtener la disponibilidad', 'error');
            setHorariosDisponibles([]);
        });
    };



    const handleConfirmModification = (horario) => {
        if (!selectedServicio || !selectedDate || !selectedCita) {
            Swal.fire('Error', 'Por favor, selecciona un servicio, día y cita antes de confirmar.', 'error');
            return;
        }

        const fechaHoraCita = `${dayjs(selectedDate).format('YYYY-MM-DD')} ${horario}`;
        const fechaHoraFormateada = dayjs(fechaHoraCita).format('D [de] MMMM [de] YYYY, HH:mm');

        Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Estás seguro de que deseas modificar tu cita?\n\n${fechaHoraFormateada}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, modificar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                axios.patch(`/citas/${selectedCita.id}/modificar`, {
                    servicio_id: selectedServicio.id,
                    fecha_hora_cita: fechaHoraCita,
                })
                .then(() => {
                    Swal.fire({
                        title: 'Cita modificada',
                        text: 'Tu cita ha sido modificada con éxito.',
                        icon: 'success',
                        confirmButtonText: 'Aceptar',
                    }).then(() => window.location.reload());
                })
                .catch((error) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: error.response?.data?.error || 'Ocurrió un error al modificar la cita.',
                    });
                });
            }
        });
    };



    const calificarCita = (citaId, valor) => {
        axios.patch(`/citas/${citaId}/calificar`, { valoracion: valor })
            .then(() => {
                Swal.fire({
                    title: 'Valoración guardada',
                    text: `Has valorado esta cita con ${valor} estrellas.`,
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => window.location.reload());
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response?.data?.error || 'Ocurrió un error al guardar la valoración',
                });
            });
    };

    const StarRating = ({ citaId, valoracion }) => {
        const [rating, setRating] = useState(valoracion || 0);

        return (
            <div className="star-rating mt-4">

                {[1, 2, 3, 4, 5].map(star => (
                    <span
                        key={star}
                        className={`text-3xl cursor-pointer ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        onClick={() => {
                            setRating(star);
                            calificarCita(citaId, star);
                        }}
                    >
                        ★
                    </span>
                ))}
            </div>


        );
    };

    const tileClassName = ({ date }) => {
        const dayOfWeek = dayjs(date).day(); // Día de la semana (0 = domingo)
        const dateStr = dayjs(date).format('YYYY-MM-DD'); // Fecha en formato YYYY-MM-DD

        // Marcar domingos
        if (dayOfWeek === 0) {
            return 'day-no-disponible text-red-500'; // Clase CSS para días no disponibles
        }

        // Marcar festivos
        if (holidays.isHoliday(dateStr)) {
            return 'day-no-disponible text-red-500'; // Clase CSS para festivos
        }

        return null; // Clase por defecto para días disponibles
    };





    const generarPDF = (cita) => {
        const doc = new jsPDF();

        // Añadir título y logo si está disponible
        doc.setFontSize(20);
        doc.text("Justificante de Pago", 105, 20, null, null, "center");

        if (logoBase64) {
            doc.addImage(logoBase64, 'PNG', 15, 40, 180, 180);
        }

        // Datos de la cita (agregados solo si están disponibles)
        doc.setFontSize(12);
        if (cita.usuario) doc.text(`Cliente: ${cita.usuario.nombre}`, 20, 80);
        if (cita.servicio) doc.text(`Servicio: ${cita.servicio.nombre}`, 20, 90);
        doc.text(`Fecha y Hora: ${dayjs(cita.fecha_hora_cita).format('DD/MM/YYYY HH:mm')}`, 20, 100);
        if (cita.barbero) doc.text(`Barbero: ${cita.barbero.nombre}`, 20, 110);
        doc.text(`Método de Pago: ${cita.metodo_pago}`, 20, 120);
        doc.text(`Estado: ${cita.estado}`, 20, 130);
        doc.text(`Precio: ${Number(cita.precio_cita || 0).toFixed(2)}€`, 20, 140);

        // Mensaje de agradecimiento
        doc.setFontSize(14);
        doc.text("Gracias por confiar en nosotros. ¡Te esperamos en nuestra barbería!", 20, 160);

        // Agregar QR si está disponible
        const qrYOffset = 170; // Posición Y para el QR debajo del mensaje
        if (qrBase64) {
            doc.addImage(qrBase64, 'PNG', 85, qrYOffset, 30, 30); // QR centrado
        }

        doc.save("Justificante_de_Pago.pdf");
    };







    return (
        <div
            style={{
                backgroundImage: `url('/images/barberia.jpg')`,
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed',
            }}
        >
            <NavigationCliente />

            <div className="container mx-auto p-8 bg-white bg-opacity-80 rounded-lg mt-10 max-w-2xl">
                <h2 className="text-4xl font-bold text-center mb-6">Próximas Citas</h2>
                <hr className="my-4 border-t-2 border-gray-300 w-full" />

                {showModificar && (
                    <div className="modify-cita-overlay fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                        <div className="modify-cita p-6 bg-gray-100 rounded-lg shadow-md w-11/12 md:w-3/4 lg:w-1/2 max-w-2xl text-center">
                            <h2 className="text-3xl font-semibold mb-6">Modificar Cita</h2>
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold mb-2">Selecciona un Servicio:</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {servicios.map((servicio) => (
                                        <div
                                            key={servicio.id}
                                            className={`servicio-card p-4 border ${selectedServicio?.id === servicio.id ? 'bg-blue-100' : 'bg-white'} rounded-lg cursor-pointer text-center`}
                                            onClick={() => handleSelectServicio(servicio)}
                                        >
                                            <h4 className="font-bold">{servicio.nombre}</h4>
                                            <p className="text-gray-500">{servicio.precio}€</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="calendar-selection text-center mt-6">
                                <h3 className="text-xl font-semibold">Selecciona el Día:</h3>
                                <Calendar
    onClickDay={handleDayClick}
    value={selectedDate}
    minDate={new Date()}
    tileClassName={tileClassName}
    className="mx-auto"
/>

                            </div>
                            {selectedDate && horariosDisponibles.length > 0 && (
    <div className="horarios-disponibles mt-4 grid grid-cols-4 gap-2 justify-center">
        {horariosDisponibles.map((hora) => (
            <button
                key={hora}
                onClick={() => handleConfirmModification(hora)}
                className="horario-button px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
                {hora}
            </button>
        ))}
    </div>
)}

                            {selectedDate && horariosDisponibles.length === 0 && (
                                <p className="text-red-500 mt-4">No hay horarios disponibles para el día seleccionado.</p>
                            )}
                            <button
                                className="mt-6 bg-gray-500 text-white px-4 py-2 rounded"
                                onClick={() => setShowModificar(false)}
                            >
                                Cancelar Modificación
                            </button>
                        </div>
                    </div>
                )}

                {/* Próximas citas */}
                {citasOrdenadas.length > 0 ? (
                    <div className="flex flex-col gap-4 mt-6 items-center">
                        {citasOrdenadas.map((cita) => {
                            const fecha = dayjs(cita.fecha_hora_cita);
                            const mes = fecha.format('MMMM');
                            const dia = fecha.format('DD');
                            const hora = fecha.format('HH:mm');
                            const año = fecha.format('YYYY');

                            return (
                                <div key={cita.id} className="p-4 border rounded-lg shadow bg-white flex justify-between items-center w-full max-w-md">
                                    <div className="text-left">
                                    <p>
                                            <strong>Método de Pago:</strong>{' '}
                                            {cita.metodo_pago === 'efectivo'
                                                ? 'Efectivo'
                                                : cita.metodo_pago === 'tarjeta'
                                                    ? 'Tarjeta'
                                                    : 'PayPal'}
                                        </p>
                                        <p><strong>Estado:</strong> <span className={getEstadoClass(cita.estado)}>{cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}</span></p>
                                        <p><strong>Barbero:</strong> {cita.barbero?.nombre || 'No asignado'}</p>
                                        <p><strong>Precio de la Cita:</strong> {Number(cita.precio_cita || 0).toFixed(2)}€</p>
                                        <p><strong>Duración:</strong> {cita.servicio?.duracion} minutos</p>




                                        <div className="mt-4 flex gap-2">
                                            <button
                                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                                onClick={() => cancelarCita(cita.id, cita.metodo_pago)}
                                            >
                                                <i className="fas fa-times"></i> {/* Ícono de cancelación */}
                                            </button>
                                            <button
                                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                onClick={() => handleModifyClick(cita)}
                                            >
                                                <i className="fas fa-edit"></i> {/* Ícono de modificación */}
                                            </button>

                                            {/* Botón de descarga para citas con pago adelantado */}
                                            {cita.metodo_pago === 'adelantado' && (
                                                <button
                                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                                    onClick={() => generarPDF(cita)}
                                                >
                                                <i className="fa-solid fa-file-arrow-down"></i>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mx-4 border-l-2 border-gray-300 h-full"></div>
                                    <div className="flex flex-col items-center text-center" style={{ color: '#D2B48C' }}>
                                        <p className="text-2xl">{mes}</p>
                                        <p className="text-4xl font-bold">{dia}</p>
                                        <p className="text-xl">{hora}</p>
                                        <p className="text-xl">{año}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-64">
                        <p className="text-xl text-gray-500 italic">No tienes citas programadas.</p>
                    </div>
                )}

                <br /><br /><br /><br />

                {/* Citas completadas o ausentes */}
                <div>
                    <h2 className="text-4xl font-bold text-center mb-6">Citas Completadas</h2>
                    <hr className="my-4 border-t-2 border-gray-300 w-full" />
                </div>
                {citasCompletadas.length > 0 ? (
                    <div className="flex flex-col gap-4 mt-6 items-center">
                        {citasCompletadas.map((cita) => {
                            const fecha = dayjs(cita.fecha_hora_cita);
                            const mes = fecha.format('MMMM');
                            const dia = fecha.format('DD');
                            const hora = fecha.format('HH:mm');
                            const año = fecha.format('YYYY');

                            return (
                                <div key={cita.id} className="p-4 border rounded-lg shadow bg-white flex justify-between items-center w-full max-w-md">
                                    <div className="text-left">
                                        <p><strong>Método de Pago:</strong> {cita.metodo_pago === 'adelantado' ? 'PayPal' : 'Efectivo'}</p>
                                        <p><strong>Estado:</strong> <span className={getEstadoClass(cita.estado)}>{cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}</span></p>
                                        <p><strong>Barbero:</strong> {cita.barbero?.nombre || 'No asignado'}</p>
                                        <p><strong>Precio de la Cita:</strong> {Number(cita.precio_cita || 0).toFixed(2)}€</p>
                                        <p><strong>Duración:</strong> {cita.servicio?.duracion} minutos</p>


                                        {cita.estado === 'completada' && (
                                            <StarRating citaId={cita.id} valoracion={cita.valoracion} />
                                        )}
                                    </div>
                                    <div className="mx-4 border-l-2 border-gray-300 h-full"></div>
                                    <div className="flex flex-col items-center text-center" style={{ color: '#D2B48C' }}>
                                        <p className="text-2xl">{mes}</p>
                                        <p className="text-4xl font-bold">{dia}</p>
                                        <p className="text-xl">{hora}</p>
                                        <p className="text-xl">{año}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-64">
                        <p className="text-xl text-gray-500 italic">No tienes citas completadas.</p>
                    </div>
                )}
            </div>
            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
            <SobreNosotros />
            <Footer />
            <WhatsAppButton />
        </div>
    );
}
