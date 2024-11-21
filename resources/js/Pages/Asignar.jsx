import React, { useState, useEffect } from 'react';
import NavigationAdmin from '../Components/NavigationAdmin';
import SobreNosotros from '../Components/Sobrenosotros';
import Footer from '../Components/Footer';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function Asignar() {
    const [barberos, setBarberos] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [selectedBarbero, setSelectedBarbero] = useState(null);
    const [selectedServicios, setSelectedServicios] = useState([]);

    // Cargar barberos y servicios desde la API
    useEffect(() => {
        axios.get('/api/barberos')
            .then(response => setBarberos(response.data))
            .catch(error => console.error("Error al cargar barberos:", error));

        axios.get('/api/servicios')
            .then(response => setServicios(response.data))
            .catch(error => console.error("Error al cargar servicios:", error));
    }, []);

    // Manejar el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedBarbero || selectedServicios.length === 0) {
            Swal.fire('Error', 'Debes seleccionar un barbero y al menos un servicio.', 'error');
            return;
        }

        axios.post('/admin/asignar-servicios', {
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

    // Manejar la selección de servicios
    const handleServicioChange = (id) => {
        setSelectedServicios(prev =>
            prev.includes(id)
                ? prev.filter(s => s !== id) // Quitar si ya está seleccionado
                : [...prev, id] // Agregar si no está seleccionado
        );
    };

    return (
        <div
            className="min-h-screen bg-cover bg-center relative text-gray-100"
            style={{ backgroundImage: "url('/images/barberia.jpg')" }}
        >
            <NavigationAdmin />

            <div className="container mx-auto p-6">
                <div className="bg-black bg-opacity-80 p-4 rounded-lg shadow-lg max-w-2xl mx-auto mb-8">
                    <h1 className="text-4xl font-bold text-center bg-white-500">
                        Asignar Servicios a Barberos
                    </h1>
                </div>
                <form onSubmit={handleSubmit} className="bg-black bg-opacity-80 p-8 rounded-lg shadow-2xl max-w-3xl mx-auto">
                    <div className="mb-6">
                        <label className="block text-xl font-semibold mb-2 bg-white-400">Seleccionar Barbero</label>
                        <select
                            className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-900 text-gray-100 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                            value={selectedBarbero || ''}
                            onChange={(e) => setSelectedBarbero(e.target.value)}
                            required
                        >
                            <option value="" disabled>Seleccione un barbero</option>
                            {barberos.map(barbero => (
                                <option key={barbero.id} value={barbero.id}>
                                    {barbero.nombre} ({barbero.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-6">
                        <label className="block text-xl font-semibold mb-2 text-yellow-400">Seleccionar Servicios</label>
                        <div className="grid grid-cols-2 gap-4">
                            {servicios.map(servicio => (
                                <label key={servicio.id} className="flex items-center bg-gray-800 p-3 rounded-lg shadow-md hover:bg-gray-700 transition-all cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="mr-3 h-5 w-5 text-yellow-500 focus:ring-yellow-400 focus:ring-2"
                                        value={servicio.id}
                                        checked={selectedServicios.includes(servicio.id)}
                                        onChange={() => handleServicioChange(servicio.id)}
                                    />
                                    <span className="text-gray-300">
                                        <span className="font-bold text-yellow-500">{servicio.nombre}</span> - <span className="text-gray-400">{servicio.precio}€</span><span className="text-gray-400"> - {servicio.duracion} mins</span>
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
            </div>
            <br /><br /><br /><br />

            <SobreNosotros />
            <Footer />
        </div>
    );
}
