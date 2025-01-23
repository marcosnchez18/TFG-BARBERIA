import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import NavigationAdmin from '../../Components/NavigationAdmin';
import SobreNosotros from '@/Components/Sobrenosotros';
import Footer from '../../Components/Footer';
import Swal from 'sweetalert2';
import axios from 'axios';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/es';
import Holidays from 'date-holidays';
import { Link } from '@inertiajs/react';

dayjs.extend(localizedFormat);
dayjs.locale('es');

export default function AdminDashboard() {
    const { user, citasHoy, nuevosUsuariosHoy, gananciasMes, nombreMesActual, valoracionMedia } = usePage().props;
    const [selectedDate, setSelectedDate] = useState(null);
    const [citasDia, setCitasDia] = useState([]);
    const holidays = new Holidays('ES', 'AN', 'CA');


    const [showCalendar, setShowCalendar] = useState(false); // Para mostrar el calendario
    const [selectedDates, setSelectedDates] = useState([]); // Para almacenar los días seleccionados
    const [highlightedDates, setHighlightedDates] = useState([]);
    const [descansos, setDescansos] = useState([]);
    const [descansosIndividuales, setDescansosIndividuales] = useState([]);
    const [productosBajoStock, setProductosBajoStock] = useState([]);
    const [notificacionVisible, setNotificacionVisible] = useState(true);


useEffect(() => {
    const fetchProductosBajoStock = async () => {
        try {
            const response = await axios.get('/api/productos-bajo-stock');
            setProductosBajoStock(response.data);
        } catch (error) {
            console.error('Error al obtener productos con bajo stock:', error);
        }
    };

    fetchProductosBajoStock();
}, []);





    const handleDateChange = async (date) => {
        try {

            setSelectedDate(date);


            const formattedDate = dayjs(date).format('YYYY-MM-DD');


            const response = await axios.get(`/admin/citas/${formattedDate}`);


            if (response.data && Array.isArray(response.data)) {
                setCitasDia(response.data);
            } else {
                console.warn('La API devolvió datos inesperados:', response.data);
                setCitasDia([]);
            }
        } catch (error) {

            console.error(`Error al obtener las citas para la fecha ${dayjs(date).format('LL')}:`, error);


            setCitasDia([]);


            Swal.fire({
                title: 'Error',
                text: 'No se pudieron cargar las citas para el día seleccionado.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
            });
        }
    };

    const renderNotificacionBajoStock = () => {
        if (!notificacionVisible || productosBajoStock.length === 0) return null;

        return (
            <div className="fixed top-4 right-4 bg-white p-4 shadow-lg rounded-lg animate-slide-in z-50 max-w-xs">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-red-600">⚠️ Productos con bajo stock</h3>
                    <button
                        onClick={() => setNotificacionVisible(false)}
                        className="text-red-500 hover:text-red-700 text-xl font-bold"
                        aria-label="Cerrar notificación"
                    >
                        ×
                    </button>
                </div>
                <ul className="space-y-2 mt-2">
                    {productosBajoStock.map((producto) => (
                        <li
                            key={producto.id}
                            className="flex items-center animate-pulse hover:animate-none transition duration-300 ease-in-out"
                        >
                            <img
                                src={producto.imagen ? `/storage/${producto.imagen}` : '/images/default-product.jpg'}
                                alt={producto.nombre}
                                onError={(e) => (e.target.src = '/images/default-product.jpg')}
                                className="w-12 h-12 rounded-full object-cover mr-3 shadow-md hover:scale-105 transition-transform duration-300 ease-in-out"
                            />
                            <div>
                                <p className="font-semibold text-gray-700 hover:text-gray-900">{producto.nombre}</p>
                                <p className="text-sm text-gray-500">
                                    Stock:
                                    <span
                                        className={`ml-1 font-bold ${
                                            producto.stock < 5 ? 'text-red-500' : 'text-green-500'
                                        }`}
                                    >
                                        {producto.stock}
                                    </span>
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
                <p className="mt-2 text-sm text-gray-600">
                    Por favor, realiza un pedido a tus proveedores.
                </p>
            </div>
        );
    };




    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const formattedDate = dayjs(date).format('YYYY-MM-DD');
            const isSunday = dayjs(date).day() === 0;
            const isHoliday = holidays.isHoliday(date);

            if (descansos.includes(formattedDate)) {
                return 'highlighted-descanso'; // Clase CSS para días de descanso
            }

            if (descansosIndividuales.includes(formattedDate)) {
                return 'highlighted-descanso-indi'; // Clase CSS para descansos individuales
            }

            if (isSunday || isHoliday) {
                return 'highlighted-holiday'; // Clase CSS para domingos y festivos
            }

            if (highlightedDates.includes(formattedDate)) {
                return 'highlighted-date'; // Clase CSS para días con citas
            }
        }
        return null;
    };


    useEffect(() => {
        axios.get('/api/citas-usuario')
            .then(response => {
                const dates = response.data.map(cita => dayjs(cita.fecha_hora_cita).format('YYYY-MM-DD'));
                setHighlightedDates([...new Set(dates)]); // Guardar fechas únicas
            })
            .catch(error => console.error('Error al obtener las citas:', error));
    }, []);

    useEffect(() => {
        axios.get('/api/admin/descansos')
            .then(response => {
                const descansoDates = response.data.map(fecha => dayjs(fecha).format('YYYY-MM-DD'));
                setDescansos(descansoDates);
            })
            .catch(error => {
                console.error('Error al obtener los días de descanso:', error);
            });
    }, []);

    useEffect(() => {
        axios.get('/api/admin/descansos-individuales')
            .then(response => {
                const individualDates = response.data.map(date => dayjs(date).format('YYYY-MM-DD'));
                setDescansosIndividuales(individualDates); // Actualiza los descansos individuales
            })
            .catch(error => {
                console.error('Error al obtener los días de descanso individuales:', error);
            });
    }, []);












    useEffect(() => {
        axios.get('/api/citas-usuario')
            .then(response => {
                // Extraer solo las fechas y formatearlas a 'YYYY-MM-DD'
                const dates = response.data.map(cita => dayjs(cita.fecha_hora_cita).format('YYYY-MM-DD'));
                setHighlightedDates([...new Set(dates)]); // Elimina duplicados
            })
            .catch(error => {
                console.error('Error al obtener las citas:', error);
            });
    }, []);



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

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        return (
            <div className="flex justify-center space-x-1">
                {[...Array(fullStars)].map((_, i) => (
                    <Star key={`full-${i}`} filled />
                ))}
                {halfStar && <Star half />}
                {[...Array(emptyStars)].map((_, i) => (
                    <Star key={`empty-${i}`} />
                ))}
            </div>
        );
    };

    const Star = ({ filled = false, half = false }) => (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="star"
        >
            <defs>
                <linearGradient id="half-fill">
                    <stop offset="50%" stopColor="#FFD700" />
                    <stop offset="50%" stopColor="#E0E0E0" />
                </linearGradient>
            </defs>
            <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill={filled ? '#FFD700' : half ? 'url(#half-fill)' : '#E0E0E0'}
            />
        </svg>
    );
    <style>
    {`
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .animate-slide-in {
            animation: slideIn 0.5s ease-out;
        }
    `}
</style>


    return (
        <div className="admin-dashboard bg-gray-100 min-h-screen"
            style={{
                backgroundImage: `url('/images/barberia.jpg')`,
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed',
            }}>
            <NavigationAdmin admin={true} />
            {renderNotificacionBajoStock()} {/* Notificación de bajo stock */}

            <div className="container mx-auto flex flex-col lg:flex-row mt-12 p-8 bg-white rounded-lg shadow-lg w-full justify-between">

                {/* Columna de estadísticas rápidas a la izquierda */}
                <div className="bg-gray-50 rounded-lg p-6 shadow-md w-full lg:max-w-xs lg:w-1/4 lg:mr-8 mb-8 lg:mb-0">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Estadísticas Rápidas</h2>
                    <div className="space-y-4">
                        <div className="stat bg-[#F7ECE3] p-4 rounded-lg text-center">
                            <p className="text-xl font-semibold text-[#A87B43]">Citas Hoy</p>
                            <span className="text-3xl font-bold">{citasHoy}</span>
                        </div>
                        <div className="stat bg-[#E7F3F3] p-4 rounded-lg text-center">
                            <p className="text-xl font-semibold text-[#4A7A7C]">Nuevos Usuarios</p>
                            <span className="text-3xl font-bold">{nuevosUsuariosHoy}</span>
                        </div>
                        <div className="herramienta-item bg-[#d0fce1] p-4 rounded-lg text-center">
                            <p className="text-lg font-semibold">Beneficios Barbería 💵</p>
                            <br />
                            <Link href={route('caja')} className="mt-2 px-4 py-2 bg-[#A87B43] text-white rounded hover:bg-[#875d34]">
                                Revisar
                            </Link>
                        </div>

                        <div className="herramienta-item bg-[#f4fcd0] p-4 rounded-lg text-center">
                            <p className="text-lg font-semibold">Revisa tus Ganancias 💰</p>
                            <br />
                            <Link href={route('ganancias.personales')} className="mt-2 px-4 py-2 bg-[#A87B43] text-white rounded hover:bg-[#875d34]">
                                Revisar
                            </Link>
                        </div>

                        <div className="stat bg-[#F3F1E4] p-4 rounded-lg text-center">
                            <p className="text-xl font-semibold text-[#A87B43]">Valoración media</p>
                            <div className="flex justify-center mt-2">
                                {renderStars(valoracionMedia || 0)}
                            </div>
                        </div>



                    </div>
                </div>

                {/* Calendario centrado */}
                <div className="flex flex-col items-center w-full lg:w-1/2">
                    <header className="text-center mb-6">
                        <h1 className="text-4xl font-extrabold text-[#A87B43]">¡Bienvenido de Nuevo, {user.nombre}!</h1>
                        <p className="text-lg text-gray-600 mt-2">Panel de Control del Administrador</p>
                    </header>
                    <div className="calendar-section mt-8 w-full flex flex-col items-center">
                        <h2 className="text-3xl font-semibold text-[#A87B43] mb-6">Calendario de Citas</h2>




                        <Calendar
                            onChange={handleDateChange}
                            value={selectedDate}
                            minDate={new Date(2000, 1, 1)}
                            className="calen-admin w-full max-w-xl mx-auto"
                            tileClassName={tileClassName}
                        />






                        
                        <br /><br />
                        <div>
    <p className="flex items-center">
        <span className="mr-2">🟢</span> Los días indican que tienes citas.
    </p>
    <p className="flex items-center">
        <span className="mr-2">🟦</span> Un día es tu selección actual.
    </p>
    <p className="flex items-center">
        <span className="mr-2">🟥</span> Los días son festivos locales.
    </p>
    <p className="flex items-center">
        <span className="mr-2">🟧</span> Los días son descansos generales.
    </p>
    <p className="flex items-center">
        <span className="mr-2">🟨</span> Los días son tus descansos propios.
    </p>
</div>


                        <style>
    {`
        /* Días con citas: Verde */
        .highlighted-date {
            background-color: #28a745; /* Verde para días con citas */

            border-radius: 50%; /* Círculo */
        }
        .highlighted-date:hover {
            background-color: #218838; /* Verde más oscuro */
        }

        /* Festivos y domingos: Rojo */
        .highlighted-holiday {
            background-color: #fde2e2; /* Fondo rojo claro */
            color: #c00; /* Rojo intenso */
        }
        .highlighted-holiday:hover {
            background-color: #f8d7da; /* Fondo más oscuro */
        }

        /* Días de descanso: Naranja (cuadrados) */
        .highlighted-descanso {
            background-color: #ffa500; /* Naranja */

            border-radius: 0; /* Sin bordes redondeados (cuadrados) */
            transition: background-color 0.3s ease;
        }
        .highlighted-descanso:hover {
            background-color: #ff8c00; /* Naranja más oscuro */
        }
/* Descansos individuales: Amarillo */
.highlighted-descanso-indi {
    background-color: #FFD700; /* Amarillo */
    color: black;
    border-radius: 0; /* Sin bordes redondeados */
}

.highlighted-descanso-indi:hover {
    background-color: #FFC107; /* Amarillo más oscuro */
}

    `}
</style>










                    </div>
                    <div className="citas-list mt-6 w-full max-w-2xl">
                        <h3 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
                            {selectedDate ? `Citas para el ${dayjs(selectedDate).format('LL')}` : 'Selecciona una fecha'}
                        </h3>
                        {citasDia.length > 0 ? (
                            <ul className="space-y-4">
                                {citasDia.map(cita => (
                                    <li key={cita.id} className="p-4 border rounded-lg bg-gray-50 shadow-md">
                                        <p><strong>Cliente:</strong> {cita.usuario.nombre}</p>
                                        <p><strong>Servicio:</strong> {cita.servicio.nombre}</p>
                                        <p><strong>Hora:</strong> {dayjs(cita.fecha_hora_cita).format('HH:mm')}</p>
                                        <p><strong>Estado:</strong> <span className={getEstadoClass(cita.estado)}>{cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}</span></p>
                                        <p><strong>Precio de la Cita:</strong> {Number(cita.precio_cita || 0).toFixed(2)}€</p>
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

                {/* Columna de herramientas adicionales a la derecha */}
                <div className="bg-gray-50 rounded-lg p-6 shadow-md w-full lg:max-w-xs lg:w-1/4 lg:ml-8 mb-8 lg:mb-0">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Herramientas Útiles</h2>



                    {/* Herramientas */}
                    <div className="space-y-4">

                        <div className="herramienta-item bg-[#dafcd0] p-4 rounded-lg text-center">
                            <p className="text-lg font-semibold">Gestiona tu Barbería ✂️</p>
                            <br />
                            <Link href={route('opciones')} className="mt-2 px-4 py-2 bg-[#A87B43] text-white rounded hover:bg-[#875d34]">
                                Gestionar
                            </Link>
                        </div>

                        <div className="herramienta-item bg-[#d0fafc] p-4 rounded-lg text-center">
                            <p className="text-lg font-semibold">Gestionar pedidos 📦</p>
                            <br />
                            <Link href={route('admin.pedidos')} className="mt-2 px-4 py-2 bg-[#A87B43] text-white rounded hover:bg-[#875d34]">
                                Gestionar
                            </Link>
                        </div>

                        <div className="herramienta-item bg-[#d0fafc] p-4 rounded-lg text-center">
                            <p className="text-lg font-semibold">Gestionar Inventario pedidos 🗠</p>
                            <br />
                            <Link href={route('admin.gestionpedido.proveedor')} className="mt-2 px-4 py-2 bg-[#A87B43] text-white rounded hover:bg-[#875d34]">
                                Gestionar
                            </Link>
                        </div>





                    </div>

                </div>

            </div>
            <br /><br /><br /><br />
            <SobreNosotros />
            <Footer />
        </div>
    );
}
