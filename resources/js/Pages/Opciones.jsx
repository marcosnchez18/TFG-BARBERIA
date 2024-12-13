import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import NavigationAdmin from '../Components/NavigationAdmin';
import SobreNosotros from '@/Components/Sobrenosotros';
import Footer from '../Components/Footer';
import Swal from 'sweetalert2';
import axios from 'axios';
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

    const [barberos, setBarberos] = useState([]);
const [barberoSeleccionado, setBarberoSeleccionado] = useState(null);
const [showCalendarBarbero, setShowCalendarBarbero] = useState(false);




    const handleGuardarDescansos = () => {
        axios.post('/admin/dias-descanso', { dias: selectedDates })
            .then(() => {
                Swal.fire('Días guardados', 'Los días de descanso se han guardado correctamente', 'success');
                setShowCalendar(false); // Cerrar el calendario después de guardar
            })
            .catch(() => {
                Swal.fire('Error', 'Hubo un problema al guardar los días de descanso', 'error');
            });
    };

    const handleGuardarDescansosBarbero = () => {
        if (!barberoSeleccionado) {
            Swal.fire('Error', 'Por favor, selecciona un barbero', 'error');
            return;
        }

        // Verifica que el user_id no sea nulo antes de enviarlo
        if (!barberoSeleccionado) {
            Swal.fire('Error', 'El ID del barbero es inválido', 'error');
            return;
        }

        axios.post('/admin/guardar-descanso-individual', {
            user_id: barberoSeleccionado, // O el ID del usuario si es otro tipo de usuario
            dias: selectedDates
        })
        .then(() => {
            Swal.fire('Días guardados', 'Los días de descanso se han guardado correctamente para el usuario', 'success');
            setShowCalendarBarbero(false); // Cerrar el calendario después de guardar
        })
        .catch(() => {
            Swal.fire('Error', 'Hubo un problema al guardar los días de descanso del usuario', 'error');
        });

    };




    const handleDateChange = (date) => {
        if (tipoDescanso === 'libre') {
            setSelectedDates([date]); // Solo un día si es día libre
        } else if (tipoDescanso === 'vacaciones') {
            setSelectedDates(date);  // Mantén el comportamiento original para vacaciones (rango de fechas)
        }
    };

    useEffect(() => {
        axios.get('/api/barberos')
            .then(response => {
                // Filtrar solo los barberos activos
                const barberosActivos = response.data.filter(barbero => barbero.estado === 'activo');
                setBarberos(barberosActivos);
            })
            .catch(error => console.error("Error al cargar los barberos:", error));
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
    selectRange={tipoDescanso === 'vacaciones'}  // Solo permite rangos si son vacaciones
    className="w-full max-w-md"
/>

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

            <h2 className="text-2xl font-semibold text-[#A87B43] mb-4 text-center">Selecciona los Días de Descanso para el Barbero</h2>

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

            {/* Seleccionar barbero */}
            <div className="mb-4">
                <label className="block text-lg font-semibold">Selecciona el Barbero</label>
                <select
                    onChange={(e) => setBarberoSeleccionado(e.target.value)}
                    className="mt-2 px-6 py-3 w-full max-w-xs border border-gray-300 rounded-lg text-lg"
                >
                    <option value="">Selecciona un Barbero</option>
                    {barberos.map(barbero => (
                        <option key={barbero.id} value={barbero.id}>{barbero.nombre}</option>
                    ))}
                </select>
            </div>

            <div className="flex justify-center mb-4">
                <Calendar
                    onChange={handleDateChange}
                    value={selectedDates}
                    selectRange={tipoDescanso === 'vacaciones'} // Solo permite rangos si son vacaciones
                    className="w-full max-w-md"
                />
            </div>

            <div className="mt-4 flex justify-between">
                <button
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    onClick={() => setShowCalendarBarbero(false)}>
                    Cancelar
                </button>
                <button
                    className="px-4 py-2 bg-[#A87B43] text-white rounded hover:bg-[#875d34]"
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




                </div>
                <br /><br />
            </div>

            <br /><br /><br />
            <SobreNosotros />
            <Footer />
        </div>
    );
}
