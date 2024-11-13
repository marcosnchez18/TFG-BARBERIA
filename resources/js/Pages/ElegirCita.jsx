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
    const [saldo, setSaldo] = useState(0); // Saldo del cliente
    const [usarSaldo, setUsarSaldo] = useState(false); // Estado del checkbox de usar saldo


    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://www.paypal.com/sdk/js?client-id=ATtT5kxLGNQytT2BLx-v6UI52wA3PFMCF2ct7kG-4R4-4XmlDUIGWfgKKLJfxEpDFKHz_bd3YhEAKFK2&currency=EUR";
        script.async = true;
        document.body.appendChild(script);
        return () => document.body.removeChild(script);
    }, []);

    useEffect(() => {
        axios.get('/api/servicios')
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

    useEffect(() => {
        axios.get('/admin/user/saldo')
            .then(response => {
                const saldoObtenido = parseFloat(response.data.saldo);
                console.log("Saldo recibido de la API:", saldoObtenido);
                setSaldo(saldoObtenido);
            })
            .catch(error => console.error("Error al obtener el saldo:", error));
    }, []);




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
        { id: 2, nombre: "Daniel Valle Vargas", imagen: "/images/hector.png" }
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
        const formattedDate = dayjs(date).format('YYYY-MM-DD');

        if (!selectedServicio) {
            console.error("Servicio no seleccionado.");
            return;
        }

        // Llama a la API para obtener los horarios disponibles con la duración específica del servicio
        axios.get(`/api/citas/horas-reservadas`, {
            params: {
                fecha: formattedDate,         // Verifica que formattedDate tenga un valor válido
                barbero_id: selectedBarbero?.id,  // Verifica que selectedBarbero esté definido
                servicio_id: selectedServicio?.id // Verifica que selectedServicio esté definido
            }
        })

        .then(response => {
            // Recibe los horarios disponibles ya ajustados en el backend según la duración
            setHorariosDisponibles(response.data);
        })
        .catch(error => console.error("Error al obtener disponibilidad:", error));
    };


    const handleSelectHorario = (horario) => {
        setSelectedTime(horario);
        setStep(4);
    };

    const handleReservation = () => {
        const descuento = usarSaldo ? Math.min(saldo, selectedServicio.precio) : 0;
        const precioFinal = selectedServicio.precio - descuento;

        if (saldo > 0) { // Solo muestra el mensaje si el saldo es mayor a 0
            Swal.fire({
                title: `Tienes ${saldo.toFixed(2)}€ de saldo. ¿Quieres canjearlo?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, canjear saldo',
                cancelButtonText: 'No, gracias',
            }).then((result) => {
                const aplicarDescuento = result.isConfirmed;

                // Si se confirma el canjeo, aplica el descuento
                const descuentoAplicado = aplicarDescuento ? Math.min(saldo, selectedServicio.precio) : 0;
                const precioFinalConDescuento = selectedServicio.precio - descuentoAplicado;

                realizarReserva(descuentoAplicado, precioFinalConDescuento);
            });
        } else {
            // Si el saldo es 0, realiza la reserva directamente sin descuento
            realizarReserva(0, precioFinal);
        }
    };

    // Función para realizar la reserva en el backend
    const realizarReserva = (descuentoAplicado, precioFinalConDescuento) => {
        const fechaHoraCita = `${dayjs(selectedDate).format('YYYY-MM-DD')} ${selectedTime}`;
        axios.post('/citas/reservar', {
            barbero_id: selectedBarbero.id,
            servicio_id: selectedServicio.id,
            fecha_hora_cita: fechaHoraCita,
            descuento_aplicado: descuentoAplicado,
            precio_cita: precioFinalConDescuento,
        })
        .then(response => {
            if (descuentoAplicado > 0) {
                axios.patch('/admin/user/quitar-saldo', { descuento: descuentoAplicado })
                    .then(() => console.log('Saldo descontado'))
                    .catch(error => console.error('Error al descontar el saldo:', error));
            }

            Swal.fire({
                title: '¡Cita Reservada!',
                html: `
                    <p><strong>Barbero:</strong> ${selectedBarbero.nombre}</p>
                    <p><strong>Servicio:</strong> ${selectedServicio.nombre} - ${precioFinalConDescuento.toFixed(2)}€</p>
                    <p><strong>Fecha y Hora:</strong> ${dayjs(selectedDate).format('DD/MM/YYYY')} ${selectedTime}</p>
                `,
                icon: 'success',
                confirmButtonText: 'Aceptar',
                showCloseButton: true
            }).then(() => {
                Swal.fire({
                    title: '¿Quieres pagar tu cita ahora?',
                    html: `<div id="paypal-button-container"></div>`,
                    showConfirmButton: false,
                    showCloseButton: true,
                    willOpen: () => {
                        window.paypal.Buttons({
                            createOrder: function(data, actions) {
                                return actions.order.create({
                                    purchase_units: [{
                                        amount: { value: precioFinalConDescuento.toFixed(2) }
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
            <br /><br />
            <div className="container mx-auto p-8 bg-white rounded-lg mt-10 shadow-lg">
                <h2 className="text-4xl font-bold text-center mb-6">Reserve su Cita</h2>
                {step === 1 && (
                    <div className="barbero-selection">
                        <h3 className="text-2xl font-semibold text-center">¿Con quién quieres reservar la cita?</h3>
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
                        <h3 className="text-2xl font-semibold text-center">Seleccione un Servicio:</h3>
                        <div className="grid grid-cols-3 gap-6 mt-6">
                            {servicios.map(servicio => (
                                <div
                                    key={servicio.id}
                                    className="servicio-card cursor-pointer p-4 text-center rounded-lg border border-gray-300 hover:bg-blue-100 transition"
                                    onClick={() => handleSelectServicio(servicio)}
                                >
                                    <h4 className="text-xl font-bold">{servicio.nombre}</h4>
                                    <p className="text-gray-600 mt-2">{servicio.precio}€</p>
                                </div>
                            ))}
                        </div>
                        <button onClick={handleBack} className="back-button mt-8 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">Volver</button>
                    </div>
                )}
                {step === 3 && (
                    <div className="calendar-selection text-center">
                        <h3 className="text-2xl font-semibold">Selecciona el día:</h3>
                        <br /><br />
                        <div className="calendar-container mt-6 flex flex-col items-center">
                            <Calendar
                                onChange={handleSelectDate}
                                value={selectedDate}
                                minDate={new Date()}
                                tileClassName={tileClassName}
                            />
                        </div>
                        <br /><br />
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
                        <br /><br />
                        <button onClick={handleBack} className="back-button mt-8 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">Volver</button>
                    </div>
                )}
                {step === 4 && (
    <div className="confirm-cita-container text-center mt-8 p-6 bg-gray-100 rounded-lg shadow-lg">
        <h3 className="text-3xl font-bold mb-6 text-[#A87B43]">Confirmación de la Cita</h3>
        <div className="confirm-details text-lg text-gray-700 mb-4">
            <p className="mb-2"><strong>Barbero:</strong> {selectedBarbero.nombre}</p>
            <p className="mb-2"><strong>Servicio:</strong> {selectedServicio.nombre} - {selectedServicio.precio}€</p>
            <p className="mb-2"><strong>Fecha y Hora:</strong> {dayjs(selectedDate).format('DD/MM/YYYY')} {selectedTime}</p>


        </div>
        <div className="button-group mt-6 flex justify-center gap-4">
            <button
                onClick={handleReservation}
                 className="backer-button mt-8 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
                Confirmar
            </button>
            <button
                onClick={handleBack}
                 className="back-button mt-8 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
                Volver
            </button>
        </div>
    </div>
)}

            </div>
            <br /><br /><br /><br />
            <SobreNosotros />
            <Footer />
            <WhatsAppButton />
        </div>
    );
}
