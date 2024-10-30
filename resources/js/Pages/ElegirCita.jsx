import React, { useState, useEffect } from 'react';
import NavigationCliente from '../Components/NavigationCliente';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import WhatsAppButton from '@/Components/Wasa';
import SobreNosotros from '@/Components/Sobrenosotros';
import Footer from '../Components/Footer';
import axios from 'axios';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import Holidays from 'date-holidays';

export default function ElegirCita() {
    const [step, setStep] = useState(1);
    const [selectedBarbero, setSelectedBarbero] = useState(null);
    const [selectedServicio, setSelectedServicio] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [servicios, setServicios] = useState([]);
    const [horariosDisponibles, setHorariosDisponibles] = useState([]);
    const [disponibilidadDias, setDisponibilidadDias] = useState({});
    const today = dayjs().startOf('day');

    const holidays = new Holidays('ES', 'AN', 'CA');

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://www.paypal.com/sdk/js?client-id=ATtT5kxLGNQytT2BLx-v6UI52wA3PFMCF2ct7kG-4R4-4XmlDUIGWfgKKLJfxEpDFKHz_bd3YhEAKFK2&currency=EUR";
        script.async = true;
        document.body.appendChild(script);
        return () => document.body.removeChild(script);
    }, []);

    useEffect(() => {
        axios.get('/data/servicios.json')
            .then(response => setServicios(response.data))
            .catch(error => console.error("Error al cargar los servicios:", error));
    }, []);

    useEffect(() => {
        if (selectedBarbero) {
            axios.get(`/api/citas/disponibilidad`, { params: { barbero_id: selectedBarbero.id } })
                .then(response => setDisponibilidadDias(response.data))
                .catch(error => console.error("Error al obtener disponibilidad:", error));
        }
    }, [selectedBarbero]);

    const tileClassName = ({ date }) => {
        const dateStr = dayjs(date).format('YYYY-MM-DD');
        const dayOfWeek = dayjs(date).day();
        if (disponibilidadDias[dateStr]?.completo) {
            return 'day-sin-citas';
        } else if (holidays.isHoliday(date) || dayOfWeek === 0) {
            return 'day-no-disponible';
        }
        return null;
    };

    const barberos = [
        { id: 1, nombre: "José Ángel Sánchez Harana", imagen: "/images/jose.png" },
        { id: 2, nombre: "Daniel Valle Vargas", imagen: "/images/daniel.png" }
    ];

    const handleSelectBarbero = (barbero) => {
        setSelectedBarbero(barbero);
        setStep(2);
    };

    const handleSelectServicio = (servicio) => {
        setSelectedServicio(servicio);
        setStep(3);
    };

    const handleSelectDate = (date) => {
        setSelectedDate(date);
        const dayOfWeek = dayjs(date).day();
        const isHoliday = holidays.isHoliday(date);
        let horarios = [];
        if (dayjs(date).isSame(today, 'day') || isHoliday) {
            setHorariosDisponibles([]);
            return;
        } else if (dayOfWeek === 6) {
            horarios = ["10:00", "10:45", "11:30", "12:15", "13:00"];
        } else if (dayOfWeek === 0) {
            setHorariosDisponibles([]);
            return;
        } else {
            horarios = [
                "10:00", "10:45", "11:30", "12:15", "13:00",
                "16:00", "16:45", "17:30", "18:15", "19:00", "19:45", "20:30"
            ];
        }
        const formattedDate = dayjs(date).format('YYYY-MM-DD');
        axios.get(`/api/citas/horas-reservadas`, {
            params: { fecha: formattedDate, barbero_id: selectedBarbero.id }
        })
        .then(response => {
            const reservedTimes = response.data;
            const availableTimes = horarios.filter(hora => !reservedTimes.includes(hora));
            setHorariosDisponibles(availableTimes);
        })
        .catch(error => console.error("Error al obtener disponibilidad:", error));
    };

    const handleSelectHorario = (horario) => {
        setSelectedTime(horario);
        setStep(4);
    };

    const handleReservation = () => {
        const fechaHoraCita = `${dayjs(selectedDate).format('YYYY-MM-DD')} ${selectedTime}`;
        axios.post('/citas/reservar', {
            barbero_id: selectedBarbero.id,
            servicio_id: selectedServicio.id,
            fecha_hora_cita: fechaHoraCita
        })
        .then(response => {
            Swal.fire({
                title: '¡Cita Reservada Exitosamente!',
                html: `
                    <p><strong>Barbero:</strong> ${selectedBarbero.nombre}</p>
                    <p><strong>Servicio:</strong> ${selectedServicio.nombre} - €${selectedServicio.precio}</p>
                    <p><strong>Fecha y Hora:</strong> ${dayjs(selectedDate).format('DD/MM/YYYY')} ${selectedTime}</p>
                `,
                icon: 'success',
                confirmButtonText: 'Aceptar',
                showCloseButton: true // Muestra la "X" para cerrar
            }).then(() => {
                Swal.fire({
                    title: '¿Quieres pagar tu cita ahora?',
                    html: `<div id="paypal-button-container"></div>`,
                    showConfirmButton: false,
                    showCloseButton: true, // Muestra la "X" para cerrar
                    willOpen: () => {
                        window.paypal.Buttons({
                            createOrder: function(data, actions) {
                                return actions.order.create({
                                    purchase_units: [{
                                        amount: { value: selectedServicio.precio }
                                    }]
                                });
                            },
                            onApprove: function(data, actions) {
                                return actions.order.capture().then(function(details) {
                                    axios.patch(`/citas/${response.data.cita_id}/actualizar-metodo-pago`, { metodo_pago: 'adelantado' })
                                    .then(() => {
                                        Swal.fire('Pago completado', `Gracias ${details.payer.name.given_name}!`, 'success');
                                    });
                                });
                            },
                            onCancel: function() {
                                axios.patch(`/citas/${response.data.cita_id}/actualizar-metodo-pago`, { metodo_pago: 'efectivo' })
                                .then(() => {
                                    Swal.fire('Pago cancelado', 'Puedes pagar en efectivo al llegar a la cita.', 'info');
                                });
                            },
                            onError: function(err) {
                                console.error("Error en el pago de PayPal:", err);
                                Swal.fire('Error', 'Hubo un problema con el pago. Inténtalo de nuevo.', 'error');
                            }
                        }).render('#paypal-button-container');
                    }
                });
            });

            setStep(1);
            setSelectedBarbero(null);
            setSelectedServicio(null);
            setSelectedDate(null);
            setSelectedTime(null);
        })
        .catch(error => {
            console.error("Error al reservar la cita:", error);
            Swal.fire({
                title: 'Error',
                text: error.response.data.error || 'Hubo un problema al reservar la cita.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        });
    };

    const handleBack = () => {
        setStep(prevStep => prevStep - 1);
    };

    return (
        <div className="elegir-cita-background">
            <NavigationCliente />
            <div className="container mx-auto p-8 bg-white rounded-lg mt-10 shadow-lg">
                <h2 className="text-4xl font-bold text-center mb-6">Reservar Cita</h2>
                {step === 1 && (
                    <div className="barbero-selection">
                        <h3 className="text-2xl font-semibold text-center">Selecciona un Barbero</h3>
                        <div className="flex justify-around mt-6">
                            {barberos.map(barbero => (
                                <div
                                    key={barbero.id}
                                    className="barbero-card cursor-pointer hover:shadow-md transition-shadow rounded-lg p-4 text-center"
                                    onClick={() => handleSelectBarbero(barbero)}
                                >
                                    <img src={barbero.imagen} alt={barbero.nombre} className="rounded-full w-32 h-32 mx-auto" />
                                    <h4 className="text-xl mt-4">{barbero.nombre}</h4>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {step === 2 && (
                    <div className="servicio-selection">
                        <h3 className="text-2xl font-semibold text-center">Selecciona un Servicio</h3>
                        <div className="grid grid-cols-2 gap-6 mt-6">
                            {servicios.map(servicio => (
                                <div
                                    key={servicio.id}
                                    className="servicio-card cursor-pointer p-4 text-center rounded-lg border border-gray-300 hover:bg-blue-100 transition"
                                    onClick={() => handleSelectServicio(servicio)}
                                >
                                    <h4 className="text-xl font-bold">{servicio.nombre}</h4>
                                    <p className="text-gray-600 mt-2">€{servicio.precio}</p>
                                </div>
                            ))}
                        </div>
                        <button onClick={handleBack} className="back-button mt-8 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">Volver</button>
                    </div>
                )}
                {step === 3 && (
                    <div className="calendar-selection text-center">
                        <h3 className="text-2xl font-semibold">Selecciona el Día</h3>
                        <div className="calendar-container mt-6 flex flex-col items-center">
                            <Calendar
                                onChange={handleSelectDate}
                                value={selectedDate}
                                minDate={new Date()}
                                tileClassName={tileClassName}
                            />
                        </div>
                        {selectedDate && horariosDisponibles.length > 0 && (
                            <div className="horarios-container mt-4 grid grid-cols-4 gap-2">
                                {horariosDisponibles.map(horario => (
                                    <button
                                        key={horario}
                                        className="horario-button px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        onClick={() => handleSelectHorario(horario)}
                                    >
                                        {horario}
                                    </button>
                                ))}
                            </div>
                        )}
                        {selectedDate && horariosDisponibles.length === 0 && (
                            <p className="text-xl text-red-500 mt-4">Sin citas disponibles</p>
                        )}
                        <button onClick={handleBack} className="back-button mt-8 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">Volver</button>
                    </div>
                )}
                {step === 4 && (
                    <div className="text-center mt-8">
                        <h3 className="text-2xl font-semibold">Confirmar Cita</h3>
                        <p className="mt-4">Barbero: {selectedBarbero.nombre}</p>
                        <p>Servicio: {selectedServicio.nombre} - €{selectedServicio.precio}</p>
                        <p>Fecha y Hora: {dayjs(selectedDate).format('DD/MM/YYYY')} {selectedTime}</p>
                        <button
                            onClick={handleReservation}
                            className="confirm-button mt-6 bg-green-500 text-white px-8 py-3 rounded-md hover:bg-green-600"
                        >
                            Confirmar Cita
                        </button>
                        <button onClick={handleBack} className="back-button mt-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">Volver</button>
                    </div>
                )}
            </div>
            <SobreNosotros />
            <Footer />
            <WhatsAppButton />
        </div>
    );
}
