import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import NavigationTrabajador from '../../Components/NavigationTrabajador';
import Footer from '../../Components/Footer';
import Swal from 'sweetalert2';
import SobreNosotros from '@/Components/Sobrenosotros';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faScissors, faEuroSign, faClock, faPen, faUserTie } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';


export default function NuevosServiciosTrab() {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [precio, setPrecio] = useState('');
    const [duracion, setDuracion] = useState('');
    const [barberos, setBarberos] = useState([]);
    const [selectedBarbero, setSelectedBarbero] = useState('');
    const { auth } = usePage().props || {};
const usuario = auth?.user || null;


    useEffect(() => {
        // Cargar los barberos desde la API
        axios.get('/api/barberos')
            .then(response => setBarberos(response.data))
            .catch(error => console.error('Error al cargar barberos:', error));
    }, []);

    useEffect(() => {
        if (usuario && usuario.rol === 'trabajador') {
            setSelectedBarbero(usuario.id);
        }
    }, [usuario]);



    const handleSubmit = (e) => {
        e.preventDefault();

        // Validar campos
        if (!nombre || !descripcion || !precio || !duracion || !selectedBarbero) {
            Swal.fire('Campos incompletos', 'Por favor, complete todos los campos y seleccione un barbero.', 'warning');
            return;
        }

        // Validar que la duración sea un número entero positivo
        if (isNaN(duracion) || duracion <= 0 || !Number.isInteger(Number(duracion))) {
            Swal.fire('Duración inválida', 'La duración debe ser un número entero positivo.', 'warning');
            return;
        }

        // Validar precio (número positivo)
        if (isNaN(precio) || precio <= 0) {
            Swal.fire('Precio inválido', 'El precio debe ser un número positivo.', 'warning');
            return;
        }

        // Mostrar alert mientras se añade el servicio
        Swal.fire({
            title: 'Añadiendo Servicio',
            text: 'El servicio se está añadiendo junto con el barbero seleccionado.',
            icon: 'info',
            showConfirmButton: true,
            allowOutsideClick: false,
            allowEscapeKey: false
        });

        Inertia.post('/trabajador/servicios', {
            nombre,
            descripcion,
            precio,
            duracion,
            barbero: selectedBarbero
        }, {
            onSuccess: () => {
                Swal.fire('Servicio añadido', 'El nuevo servicio y su asignación han sido creados exitosamente.', 'success');
                setNombre('');
                setDescripcion('');
                setPrecio('');
                setDuracion('');
                setSelectedBarbero('');
            },
            onError: () => {
                Swal.fire('Error', 'Hubo un problema al añadir el servicio.', 'error');
            }
        });
    };

    return (
        <div className="admin-dashboard min-h-screen bg-cover bg-center"
            style={{
                backgroundImage: `url('/images/barberia.jpg')`,
                backgroundAttachment: 'fixed',
            }}>
            <NavigationTrabajador admin={true} />
            <div className="container mx-auto p-8">
                <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg w-full max-w-md mx-auto mt-20 relative">
                    <div className="absolute top-2 right-2">
                        <Link href="/opciones-trabajador" className="text-black-600 text-xl font-bold hover:text-gray-400">✕</Link>
                    </div>
                    <h1 className="text-4xl font-extrabold text-center text-[#000000] mb-6">Añadir Nuevo Servicio</h1>
                    <form onSubmit={handleSubmit} className="p-8">
                        <div className="mb-6">
                            <label className="block text-gray-700 font-bold mb-2">Nombre del Servicio:</label>
                            <div className="relative">
                                <FontAwesomeIcon icon={faScissors} className="absolute left-3 top-3 text-gray-500" />
                                <input
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    className="w-full pl-10 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A87B43]"
                                    placeholder="Ej. Corte de pelo"
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 font-bold mb-2">Descripción:</label>
                            <div className="relative">
                                <FontAwesomeIcon icon={faPen} className="absolute left-3 top-3 text-gray-500" />
                                <textarea
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    className="w-full pl-10 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A87B43]"
                                    placeholder="Describa el servicio..."
                                    required
                                ></textarea>
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 font-bold mb-2">Precio (€):</label>
                            <div className="relative">
                                <FontAwesomeIcon icon={faEuroSign} className="absolute left-3 top-3 text-gray-500" />
                                <input
                                    type="number"
                                    step="0.01"
                                    value={precio}
                                    onChange={(e) => setPrecio(e.target.value)}
                                    className="w-full pl-10 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A87B43]"
                                    placeholder="Ej. 15.00"
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 font-bold mb-2">Duración (minutos):</label>
                            <div className="relative">
                                <FontAwesomeIcon icon={faClock} className="absolute left-3 top-3 text-gray-500" />
                                <input
                                    type="number"
                                    step="1"
                                    value={duracion}
                                    onChange={(e) => setDuracion(e.target.value)}
                                    className="w-full pl-10 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A87B43]"
                                    placeholder="Ej. 30"
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-6">
    <label className="block text-gray-700 font-bold mb-2">Barbero:</label>
    <div className="relative">
        <FontAwesomeIcon icon={faUserTie} className="absolute left-3 top-3 text-gray-500" />
        <select
            value={selectedBarbero}
            disabled
            className="w-full pl-10 px-4 py-3 border rounded-lg bg-gray-200 cursor-not-allowed"
        >
            <option key={usuario?.id} value={usuario?.id}>
                {usuario?.nombre}
            </option>
        </select>
    </div>
</div>


                        <div className="text-center">
                            <button
                                type="submit"
                                className="px-6 py-3 text-white bg-[#A87B43] font-semibold rounded-lg hover:bg-[#875d34] transition-all duration-200"
                            >
                                Añadir Servicio
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <SobreNosotros />
            <Footer />
        </div>
    );
}
