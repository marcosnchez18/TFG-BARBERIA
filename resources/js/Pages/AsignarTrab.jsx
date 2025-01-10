import React, { useState, useEffect } from 'react';
import SobreNosotros from '../Components/Sobrenosotros';
import Footer from '../Components/Footer';
import Swal from 'sweetalert2';
import axios from 'axios';
import { Link, router } from '@inertiajs/react';
import NavigationTrabajador from '@/Components/NavigationTrabajador';
import { usePage } from '@inertiajs/react';

export default function AsignarTrab() {
    const [activeTab, setActiveTab] = useState('asignar');
    const [barberos, setBarberos] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [selectedBarbero, setSelectedBarbero] = useState(null);
    const [selectedServicios, setSelectedServicios] = useState([]);
    const [assignedServices, setAssignedServices] = useState([]);
    const { auth } = usePage().props || {};
const usuario = auth?.user || null;

    // Cargar barberos y servicios desde la API
    useEffect(() => {
        axios.get('/api/barberos')
            .then(response => setBarberos(response.data))
            .catch(error => console.error("Error al cargar barberos:", error));

        axios.get('/api/servicios')
            .then(response => setServicios(response.data))
            .catch(error => console.error("Error al cargar servicios:", error));
    }, []);

    useEffect(() => {
    if (usuario && usuario.rol === 'trabajador') {
        setSelectedBarbero(usuario.id);
    }
}, [usuario]);


    // Manejar el cambio de pestaña
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSelectedBarbero(null);
        setAssignedServices([]);
    };

    // Manejar el envío del formulario de asignar servicios
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedBarbero || selectedServicios.length === 0) {
            Swal.fire('Error', 'Debes seleccionar un barbero y al menos un servicio.', 'error');
            return;
        }

        axios.post('/trabajador/asignar-servicios', {
            barbero_id: selectedBarbero,
            servicios: selectedServicios,
        })
            .then(() => {
                Swal.fire('Éxito', 'Servicios asignados correctamente.', 'success');
                setSelectedBarbero(null);
                setSelectedServicios([]);
            })
            .catch(error => {
                Swal.fire('Error', error.response?.data?.message || 'Ocurrió un error al asignar los servicios.', 'error');
            });
    };

    // Cargar servicios asignados al cambiar el barbero seleccionado
    useEffect(() => {
        if (activeTab === 'ver' && selectedBarbero) {
            axios.get(`/api/trabajador/asignar/barberos/${selectedBarbero}/servicios`)
                .then(response => setAssignedServices(response.data))
                .catch(error => console.error("Error al cargar servicios asignados:", error));
        }
    }, [selectedBarbero, activeTab]);

    // Manejar la desasignación de servicios
    const handleUnassign = (serviceId) => {
        axios.post('/trabajador/desasignar-servicio', {
            barbero_id: selectedBarbero,
            servicio_id: serviceId,
        })
            .then(() => {
                Swal.fire('Éxito', 'Servicio desasignado correctamente.', 'success');
                setAssignedServices(assignedServices.filter(service => service.id !== serviceId));
            })
            .catch(error => {
                Swal.fire('Error', error.response?.data?.message || 'Ocurrió un error al desasignar el servicio.', 'error');
            });
    };

    return (
        <div
            className="min-h-screen bg-cover bg-center relative text-gray-100"
            style={{ backgroundImage: "url('/images/barberia.jpg')" }}
        >
            <NavigationTrabajador />


            <div className="min-h-screen bg-cover bg-center relative text-gray-100 bg-white bg-opacity-80 p-8 rounded-lg shadow-lg w-full max-w-3xl mx-auto mt-20">

                <div className="absolute top-2 right-2">
                    <Link href="/opciones-trabajador" className="text-black text-xl font-bold hover:text-gray-900">✕</Link>
                </div>
                {/* Pestañas */}
                <div className="flex justify-center mb-6">
                    <button
                        className={`px-6 py-2 text-lg font-bold rounded-t-lg ${activeTab === 'asignar' ? 'bg-yellow-600 text-white' : 'bg-gray-800 text-gray-300'}`}
                        onClick={() => handleTabChange('asignar')}
                    >
                        Asignar Servicios
                    </button>
                    <button
                        className={`px-6 py-2 text-lg font-bold rounded-t-lg ${activeTab === 'ver' ? 'bg-yellow-600 text-white' : 'bg-gray-800 text-gray-300'}`}
                        onClick={() => handleTabChange('ver')}
                    >
                        Ver Servicios
                    </button>
                </div>

                {/* Contenido de la pestaña */}
                {activeTab === 'asignar' && (
                    <form onSubmit={handleSubmit} className="bg-black bg-opacity-80 p-8 rounded-lg shadow-2xl max-w-3xl mx-auto">
                        <div className="mb-6">
    <label className="block text-xl font-semibold mb-2">Seleccionar Barbero</label>
    <select
        className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-900 text-gray-100 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
        value={selectedBarbero || ''}
        onChange={(e) => {
            const selectedId = e.target.value;
            if (selectedId !== usuario?.id.toString()) {
                Swal.fire('Acceso denegado', 'Solo puedes seleccionar tu propio usuario.', 'warning');
            } else {
                setSelectedBarbero(selectedId);
            }
        }}
        required
    >
        <option value="" disabled>Seleccione un barbero</option>
        {barberos.map(barbero => (
            <option
                key={barbero.id}
                value={barbero.id}
                style={{
                    color: barbero.id !== usuario?.id ? 'red' : 'white', // Rojo si no es seleccionable
                    fontWeight: barbero.id !== usuario?.id ? 'bold' : 'normal'
                }}
            >
                {barbero.nombre} ({barbero.email}) {barbero.id !== usuario?.id ? ' - No seleccionable' : ''}
            </option>
        ))}
    </select>
</div>




                        <div className="mb-6">
                            <label className="block text-xl font-semibold mb-2">Seleccionar Servicios</label>
                            <div className="grid grid-cols-2 gap-4">
                                {servicios.map(servicio => (
                                    <label key={servicio.id} className="flex items-center bg-gray-800 p-3 rounded-lg shadow-md hover:bg-gray-700 transition-all cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="mr-3 h-5 w-5 text-yellow-500 focus:ring-yellow-400 focus:ring-2"
                                            value={servicio.id}
                                            checked={selectedServicios.includes(servicio.id)}
                                            onChange={() => setSelectedServicios(prev =>
                                                prev.includes(servicio.id)
                                                    ? prev.filter(s => s !== servicio.id)
                                                    : [...prev, servicio.id]
                                            )}
                                        />
                                        <span className="text-gray-300">
                                            <span className="font-bold text-yellow-500">{servicio.nombre}</span> - <span className="text-gray-400">{servicio.precio}€</span>
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 px-6 text-lg font-bold bg-gradient-to-r from-yellow-600 to-brown-500 rounded-lg hover:from-brown-600 hover:to-yellow-500 transition-all text-white shadow-lg hover:shadow-2xl"
                        >
                            Asignar Servicios
                        </button>
                    </form>
                )}

                {activeTab === 'ver' && (
                    <div className="bg-black bg-opacity-80 p-8 rounded-lg shadow-2xl max-w-3xl mx-auto">
                        <h1 className="text-4xl font-bold text-center text-yellow-500 mb-6">Servicios Asignados</h1>
                        <div className="mb-6">
    <label className="block text-xl font-semibold mb-2">Seleccionar Barbero</label>
    <select
        className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-900 text-gray-100 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
        value={selectedBarbero || ''}
        onChange={(e) => {
            const selectedId = e.target.value;
            if (selectedId !== usuario?.id.toString()) {
                Swal.fire('Acceso denegado', 'Solo puedes seleccionar tu propio usuario.', 'warning');
            } else {
                setSelectedBarbero(selectedId);
            }
        }}
        required
    >
        <option value="" disabled>Seleccione un barbero</option>
        {barberos.map(barbero => (
            <option
                key={barbero.id}
                value={barbero.id}
                style={{
                    color: barbero.id !== usuario?.id ? 'red' : 'white', 
                    fontWeight: barbero.id !== usuario?.id ? 'bold' : 'normal'
                }}
            >
                {barbero.nombre} ({barbero.email}) {barbero.id !== usuario?.id ? ' - No seleccionable' : ''}
            </option>
        ))}
    </select>
</div>




                        <div className="grid grid-cols-1 gap-4">
                            {assignedServices.map(servicio => (
                                <div key={servicio.id} className="flex justify-between items-center bg-gray-800 p-4 rounded-lg shadow-md">
                                    <span className="text-gray-300 font-bold">{servicio.nombre} - {servicio.precio}€</span>
                                    <button
                                        onClick={() => handleUnassign(servicio.id)}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                    >
                                        Desasignar
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
                <br /><br /><br /><br /><br />
            <SobreNosotros />
            <Footer />
        </div>
    );
}
