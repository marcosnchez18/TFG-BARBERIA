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
import Holidays from 'date-holidays';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/es';
import { Link } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus,
    faEdit,
    faUserPlus,
    faCalendarAlt,
    faTasks,
    faShop,
    faPlusCircle
} from '@fortawesome/free-solid-svg-icons';

dayjs.extend(localizedFormat);
dayjs.locale('es');

export default function Opciones() {
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDates, setSelectedDates] = useState([]);
    const [tipoDescanso, setTipoDescanso] = useState(''); // 'libre' o 'vacaciones'
    const holidays = new Holidays('ES', 'AN', 'CA');

    const [barberos, setBarberos] = useState([]);
    const [barberoSeleccionado, setBarberoSeleccionado] = useState(null);
    const [showCalendarBarbero, setShowCalendarBarbero] = useState(false);

    const [descansos, setDescansos] = useState([]);
    const [descansosIndividuales, setDescansosIndividuales] = useState([]);

    const [citasVerde, setCitasVerde] = useState([]);
const [citasVioleta, setCitasVioleta] = useState([]);






    const handleGuardarDescansos = () => {
        if (selectedDates.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Atención',
                text: 'Por favor, selecciona al menos un día antes de guardar.',
            });
            return;
        }

        axios.post('/admin/dias-descanso', { dias: selectedDates })
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Días guardados',
                    text: 'Los días de descanso se han guardado correctamente.',
                }).then(() => {
                    window.location.reload(); // Recargar la página
                });
            })
            .catch((error) => {
                const errorMessage = error.response?.data?.message || 'Hubo un problema al guardar los días de descanso';
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errorMessage,
                });
            });
    };

    const tileDisabled = ({ date }) => {
        return dayjs(date).isBefore(dayjs(), 'day');
    };

    const handleBarberoChange = (e) => {
        const barberoId = e.target.value;
        setBarberoSeleccionado(barberoId);

        if (barberoId) {

            axios.get(`/barbero/${barberoId}/descansos-individuales`)
                .then((response) => {
                    const individualDates = response.data.map(date => dayjs(date).format('YYYY-MM-DD'));
                    setDescansosIndividuales(individualDates);
                })
                .catch((error) => {
                    console.error('Error al obtener los días de descanso individuales:', error);
                });
        } else {
            setDescansosIndividuales([]);
        }
    };





    const handleGuardarDescansosBarbero = () => {
        if (!barberoSeleccionado) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, selecciona un barbero.',
            });
            return;
        }

        if (selectedDates.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Atención',
                text: 'Por favor, selecciona al menos un día antes de guardar.',
            });
            return;
        }

        axios.post('/admin/guardar-descanso-individual', {
            user_id: barberoSeleccionado,
            dias: selectedDates,
        })
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Días guardados',
                    text: 'Los días de descanso se han guardado correctamente para el usuario.',
                }).then(() => {
                    window.location.reload(); // Recargar la página
                });
            })
            .catch((error) => {
                const errorMessage = error.response?.data?.message || 'Hubo un problema al guardar los días de descanso del usuario';
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errorMessage,
                });
            });
    };



    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const formattedDate = dayjs(date).format('YYYY-MM-DD');
            const isSunday = dayjs(date).day() === 0;
            const isHoliday = holidays.isHoliday(date);

            if (isSunday || isHoliday) {
                return 'highlighted-holiday';
            }

            if (descansos.includes(formattedDate)) {
                return 'highlighted-descanso'; // Clase CSS para días de descanso
            }

            if (descansosIndividuales.includes(formattedDate)) {
                return 'highlighted-descanso-barbero'; // Clase para descansos individuales
            }

            if (selectedDates.some(selectedDate => dayjs(selectedDate).format('YYYY-MM-DD') === formattedDate)) {
                return 'highlighted-date';
            }

            if (citasVerde.includes(formattedDate)) {
                return 'highlighted-green'; // Clase para días en verde
            }

            if (citasVioleta.includes(formattedDate)) {
                return 'highlighted-purple'; // Clase para días en violeta
            }
        }
        return null;
    };





    const handleDateChange = (date) => {
        if (tipoDescanso === 'libre') {
            setSelectedDates([date]);
        } else if (tipoDescanso === 'vacaciones') {
            setSelectedDates(date);
        }
    };

    useEffect(() => {
        axios.get('/api/barberos')
            .then(response => {

                const barberosActivos = response.data.filter(barbero => barbero.estado === 'activo');
                setBarberos(barberosActivos);
            })
            .catch(error => console.error("Error al cargar los barberos:", error));
    }, []);


    useEffect(() => {
        // Citas del barbero actual
        axios.get('/api/citas-barbero-actual')
            .then(response => {
                const dates = response.data.map(date => dayjs(date).format('YYYY-MM-DD'));
                setCitasVerde(dates);
            })
            .catch(error => {
                console.error('Error al obtener las citas del barbero actual:', error);
            });

        // Citas de todos los barberos
        axios.get('/api/citas-todos')
            .then(response => {
                const dates = response.data.map(date => dayjs(date).format('YYYY-MM-DD'));
                setCitasVioleta(dates);
            })
            .catch(error => {
                console.error('Error al obtener las citas de todos los barberos:', error);
            });
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




    return (
        <div className="admin-dashboard bg-gray-100 min-h-screen"
            style={{
                backgroundImage: `url('/images/barberia.jpg')`,
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed',
            }}>
            <NavigationAdmin admin={true} />


            {/* Sección de Herramientas */}
            <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-7xl mx-auto  mt-20 relative">
                <div className="absolute top-2 right-2">
                    <Link href="/mi-gestion-admin" className="text-black-600 text-xl font-bold hover:text-gray-400">✕</Link>
                </div>
                <h2 className="text-3xl font-semibold mb-6 text-center">Herramientas Útiles</h2>
                <br /><br />

                {/* Barra de búsqueda */}
                <div className="relative mb-4 w-full max-w-md mx-auto">
                    <input
                        type="text"
                        placeholder="Buscar acción..."
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#A87B43]"
                        onChange={(e) => {
                            const query = e.target.value.toLowerCase();
                            const herramientas = document.querySelectorAll('.herramienta-item');
                            herramientas.forEach((herramienta) => {
                                const texto = herramienta.textContent.toLowerCase();
                                herramienta.style.display = texto.includes(query) ? '' : 'none';
                            });
                        }}
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute right-2 top-2 h-6 w-6 text-gray-400 pointer-events-none"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
                <br />
                {/* Herramientas en Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                    <div className="herramienta-item bg-[#E3F7F7] p-4 rounded-lg text-center">
                        <FontAwesomeIcon icon={faPlus} className="text-[#A87B43] text-4xl mb-2" />
                        <p className="text-lg font-semibold">Nuevo Servicio</p>
                        <br />
                        <Link href={route('admin.servicios.create')} className="mt-2 px-4 py-2 bg-[#A87B43] text-white rounded hover:bg-[#875d34]">
                            Añadir
                        </Link>
                    </div>

                    <div className="herramienta-item bg-[#E3E7F7] p-4 rounded-lg text-center">
                        <FontAwesomeIcon icon={faTasks} className="text-[#4A7A7C] text-4xl mb-2" />
                        <p className="text-lg font-semibold">Asignar Servicios</p>
                        <br />
                        <Link href={route('admin.asignar.servicios')} className="mt-2 px-4 py-2 bg-[#A87B43] text-white rounded hover:bg-[#875d34]">
                            Asignar
                        </Link>
                    </div>

                    <div className="herramienta-item bg-[#dafcd0] p-4 rounded-lg text-center">
                        <FontAwesomeIcon icon={faEdit} className="text-[#4A7A7C] text-4xl mb-2" />
                        <p className="text-lg font-semibold">Editar Servicios</p>
                        <br />
                        <Link href={route('admin.servicios.editar')} className="mt-2 px-4 py-2 bg-[#A87B43] text-white rounded hover:bg-[#875d34]">
                            Editar
                        </Link>
                    </div>


                    <div className="herramienta-item bg-[#F7E3E3] p-4 rounded-lg text-center">
                        <FontAwesomeIcon icon={faUserPlus} className="text-[#A87B43] text-4xl mb-2" />
                        <p className="text-lg font-semibold">Alta Barbero</p>
                        <br />
                        <Link href={route('admin.barberos.create')} className="mt-2 px-4 py-2 bg-[#A87B43] text-white rounded hover:bg-[#875d34]">
                            Crear Usuario
                        </Link>
                    </div>



                    <div className="herramienta-item bg-[#acc6d6] p-4 rounded-lg text-center">
                        <FontAwesomeIcon icon={faEdit} className="text-[#4A7A7C] text-4xl mb-2" />
                        <p className="text-lg font-semibold">Editar Barberos</p>
                        <br />
                        <Link
                            href={route('admin.barberos.editar')}
                            className="mt-2 px-4 py-2 bg-[#A87B43] text-white rounded hover:bg-[#875d34]"
                        >
                            Editar
                        </Link>
                    </div>

                    <div className="herramienta-item bg-[#E3E7F7] p-4 rounded-lg text-center">
                        <FontAwesomeIcon icon={faCalendarAlt} className="text-[#4A7A7C] text-4xl mb-2" />
                        <p className="text-lg font-semibold">Gestionar Vacaciones</p>
                        <br />
                        <button
                            onClick={() => setShowCalendar(true)} // Abre el calendario al hacer clic
                            className="mt-2 px-4 py-2 bg-[#A87B43] text-white rounded hover:bg-[#875d34]">
                            Seleccionar Días
                        </button>




                        {/* Modal del Calendario */}
                        {showCalendar && (
                            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                                <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
                                    <button
                                        onClick={() => setShowCalendar(false)} // Cerrar el modal
                                        className="absolute top-2 right-2 text-xl text-gray-500 hover:text-gray-700">
                                        ×
                                    </button>

                                    <h2 className="text-2xl font-semibold text-[#A87B43] mb-4 text-center">Selecciona los Días de Descanso</h2>

                                    <div className="mb-4">
                                        <label className="block text-lg font-semibold">¿Qué tipo de descanso es?</label>
                                        <select
                                            onChange={(e) => setTipoDescanso(e.target.value)}
                                            className="mt-2 px-6 py-3 w-full max-w-xs border border-gray-300 rounded-lg text-lg"
                                        >
                                            <option value="">Selecciona una opción</option>
                                            <option value="libre">Es un día libre</option>
                                            <option value="vacaciones">Son vacaciones</option>
                                        </select>
                                    </div>

                                    <div className="flex justify-center mb-4">
                                        <Calendar
                                            onChange={handleDateChange}
                                            value={selectedDates}
                                            selectRange={tipoDescanso === 'vacaciones'}
                                            className="w-full max-w-md"
                                            tileClassName={tileClassName}
                                            tileDisabled={tileDisabled}
                                        />


<style>
                                            {`
        /* Días seleccionados (verde para citas) */
        .highlighted-date {


            border-radius: 50%; /* Círculo */
            transition: background-color 0.3s ease;
        }
        .highlighted-date:hover {
            background-color: #218838; /* Verde más oscuro */
        }

        /* Festivos y domingos (rojo claro) */
        .highlighted-holiday {
            background-color: #fde2e2; /* Rojo claro */
            color: #c00; /* Rojo oscuro para el texto */
        }
        .highlighted-holiday:hover {
            background-color: #f8d7da; /* Fondo ligeramente más oscuro */
        }

        /* Días seleccionados como vacaciones (azul y cuadrados) */
        .highlighted-vacation {
            background-color: #007bff; /* Azul claro */

            border-radius: 0; /* Cuadrado */
            transition: background-color 0.3s ease;
        }
        .highlighted-vacation:hover {
            background-color: #0056b3; /* Azul más oscuro */
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

        /* Días de descanso individual (marrón) */
.highlighted-descanso-barbero {
    background-color: #8B4513; /* Marrón */
    color: white; /* Texto blanco */
    border-radius: 0; /* Cuadrado */
    transition: background-color 0.3s ease;
}
.highlighted-descanso-barbero:hover {
    background-color: #5D3313; /* Marrón más oscuro */
}

/* Descansos individuales: Amarillo */
.highlighted-descanso-indi {

    color: black;
    border-radius: 0; /* Sin bordes redondeados */
}

.highlighted-descanso-indi:hover {
    background-color: #FFC107; /* Amarillo más oscuro */
}

/* Días en verde (citas del barbero actual) */
.highlighted-green {
    background-color: #28a745; /* Verde */

    border-radius: 50%;
}

/* Días en violeta (citas de todos los barberos) */
.highlighted-purple {
    background-color: #6f42c1; /* Violeta */

    border-radius: 50%;
}

    `}
                                        </style>




                                    </div>

                                    <div className="legend ml-20">
    <p className="flex items-center">
        <span className="mr-2">🔵</span> Día libre / Primer y último día de vacaciones
    </p>
    <p className="flex items-center">
        <span className="mr-2">🟦</span> Días intermedios de vacaciones
    </p>
    <p className="flex items-center">
        <span className="mr-2">🟥</span> Festivos locales
    </p>
    <p className="flex items-center">
        <span className="mr-2">🟧</span> Descansos generales
    </p>
    <p className="flex items-center">
        <span className="mr-2">🟫</span> Tus descansos
    </p>
    <p className="flex items-center">
        <span className="mr-2">🟢</span> Próximas citas
    </p>
    <p className="flex items-center">
        <span className="mr-2">🟣</span> Citas de barberos
    </p>
</div>



                                    <div className="mt-4 flex justify-between">
                                        <button
                                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                            onClick={() => setShowCalendar(false)}>
                                            Cancelar
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-[#A87B43] text-white rounded hover:bg-[#875d34]"
                                            onClick={handleGuardarDescansos}>
                                            Guardar Días
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="herramienta-item bg-[#e3f7ee] p-4 rounded-lg text-center">
                        <FontAwesomeIcon icon={faCalendarAlt} className="text-[#4A7A7C] text-4xl mb-2" />
                        <p className="text-lg font-semibold">Gestionar Vacaciones Barbero</p>
                        <br />
                        <button
                            onClick={() => setShowCalendarBarbero(true)} // Abre el calendario al hacer clic
                            className="mt-2 px-4 py-2 bg-[#A87B43] text-white rounded hover:bg-[#875d34]">
                            Seleccionar Días
                        </button>
                    </div>


                    {showCalendarBarbero && (
                        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
                                <button
                                    onClick={() => setShowCalendarBarbero(false)} // Cerrar el modal
                                    className="absolute top-2 right-2 text-xl text-gray-500 hover:text-gray-700">
                                    ×
                                </button>

                                <h2 className="text-2xl font-semibold text-[#A87B43] mb-6 text-center">
                                    Selecciona los Descansos para el Barbero
                                </h2>

                                {/* Contenedor centrado */}
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="w-full max-w-md">
                                        <label className="block text-lg font-semibold mb-2 text-center">¿Qué tipo de descanso es?</label>
                                        <select
                                            onChange={(e) => setTipoDescanso(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-[#A87B43]"
                                        >
                                            <option value="">Selecciona una opción</option>
                                            <option value="libre">Es un día libre</option>
                                            <option value="vacaciones">Son vacaciones</option>
                                        </select>
                                    </div>

                                    <div className="w-full max-w-md">
                                        <label className="block text-lg font-semibold mb-2 text-center">Selecciona el Barbero</label>
                                        <select
    onChange={handleBarberoChange}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-[#A87B43]"
>
    <option value="">Selecciona un Barbero</option>
    {barberos.map(barbero => (
        <option key={barbero.id} value={barbero.id}>{barbero.nombre}</option>
    ))}
</select>

                                    </div>

                                    <div className="w-full flex justify-center">
                                        <Calendar
                                            onChange={handleDateChange}
                                            value={selectedDates}
                                            selectRange={tipoDescanso === 'vacaciones'}
                                            className="w-full max-w-md"
                                            tileClassName={tileClassName}
                                            tileDisabled={tileDisabled}
                                        />

                                        <style>
                                            {`
        /* Días seleccionados (verde para citas) */
        .highlighted-date {


            border-radius: 50%; /* Círculo */
            transition: background-color 0.3s ease;
        }
        .highlighted-date:hover {
            background-color: #218838; /* Verde más oscuro */
        }

        /* Festivos y domingos (rojo claro) */
        .highlighted-holiday {
            background-color: #fde2e2; /* Rojo claro */
            color: #c00; /* Rojo oscuro para el texto */
        }
        .highlighted-holiday:hover {
            background-color: #f8d7da; /* Fondo ligeramente más oscuro */
        }

        /* Días seleccionados como vacaciones (azul y cuadrados) */
        .highlighted-vacation {
            background-color: #007bff; /* Azul claro */

            border-radius: 0; /* Cuadrado */
            transition: background-color 0.3s ease;
        }
        .highlighted-vacation:hover {
            background-color: #0056b3; /* Azul más oscuro */
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

    color: black;
    border-radius: 0; /* Sin bordes redondeados */
}

.highlighted-descanso-indi:hover {
    background-color: #FFC107; /* Amarillo más oscuro */
}

/* Días en verde (citas del barbero actual) */
.highlighted-green {
    background-color: #28a745; /* Verde */

    border-radius: 50%;
}

/* Días de descanso individual (marrón) */
.highlighted-descanso-barbero {
    background-color: #8B4513; /* Marrón */
    color: white; /* Texto blanco */
    border-radius: 0; /* Cuadrado */
    transition: background-color 0.3s ease;
}
.highlighted-descanso-barbero:hover {
    background-color: #5D3313; /* Marrón más oscuro */
}


/* Días en violeta (citas de todos los barberos) */
.highlighted-purple {
    background-color: #6f42c1; /* Violeta */

    border-radius: 50%;
}

    `}
                                        </style>
                                    </div>

                                    <div className="legend">
    <p><span>🔵</span> Día libre / Primer y último día de vacaciones</p>
    <p><span>🟦</span> Días intermedios de vacaciones</p>
    <p><span>🟥</span> Festivos locales</p>
    <p><span>🟧</span> Descansos generales</p>
    <p><span>🟫</span> Tus descansos</p>
    <p><span>🟢</span> Próximas citas</p>
    <p><span>🟣</span> Citas de barberos</p>
</div>

                                </div>

                                <div className="mt-6 flex justify-between">
                                    <button
                                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                        onClick={() => setShowCalendarBarbero(false)}>
                                        Cancelar
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-[#A87B43] text-white rounded-lg hover:bg-[#875d34]"
                                        onClick={handleGuardarDescansosBarbero}>
                                        Guardar Días
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}



                    <div className="herramienta-item bg-[#f0fcd0] p-4 rounded-lg text-center">
                        <FontAwesomeIcon icon={faShop} className="text-[#4A7A7C] text-4xl mb-2" />

                        <p className="text-lg font-semibold">Alta Proveedor</p>
                        <br />
                        <Link href={route('admin.proveedores.nuevo')} className="mt-2 px-4 py-2 bg-[#A87B43] text-white rounded hover:bg-[#875d34]">
                            Añadir
                        </Link>
                    </div>

                    <div className="herramienta-item bg-[#d0fce2] p-4 rounded-lg text-center">
                        <FontAwesomeIcon icon={faEdit} className="text-[#4A7A7C] text-4xl mb-2" />

                        <p className="text-lg font-semibold">Editar Proveedores</p>
                        <br />
                        <Link href={route('admin.proveedores.editar')} className="mt-2 px-4 py-2 bg-[#A87B43] text-white rounded hover:bg-[#875d34]">
                            Editar
                        </Link>
                    </div>

                    <div className="herramienta-item bg-[#f0f8ff] p-4 rounded-lg text-center">
                        <FontAwesomeIcon icon={faPlusCircle} className="text-[#6c757d] text-4xl mb-2" />

                        <p className="text-lg font-semibold">Añadir Producto</p>
                        <br />
                        <Link href={route('admin.productos.crear')} className="mt-2 px-4 py-2 bg-[#A87B43] text-white rounded hover:bg-[#218838]">
                            Añadir
                        </Link>
                    </div>

                    <div className="herramienta-item bg-[#fce8ff] p-4 rounded-lg text-center">
                        <FontAwesomeIcon icon={faEdit} className="text-[#6c757d] text-4xl mb-2" />

                        <p className="text-lg font-semibold">Editar Productos</p>
                        <br />
                        <Link href={route('admin.productos.editar')} className="mt-2 px-4 py-2 bg-[#A87B43] text-white rounded hover:bg-[#e0a800]">
                            Editar
                        </Link>
                    </div>

                    <div className="herramienta-item bg-[#e8feff] p-4 rounded-lg text-center">
                    <FontAwesomeIcon icon={faPlusCircle} className="text-[#6c757d] text-4xl mb-2" />

                        <p className="text-lg font-semibold">Pedidos a proveedores</p>
                        <br />
                        <Link href={route('admin.pedido.proveedor')} className="mt-2 px-4 py-2 bg-[#A87B43] text-white rounded hover:bg-[#e0a800]">
                            Pedir
                        </Link>
                    </div>




                </div>
                <br /><br />
            </div>

            <br /><br /><br />
            <SobreNosotros />
            <Footer />
        </div>
    );
}
