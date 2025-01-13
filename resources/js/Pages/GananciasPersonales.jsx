import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import NavigationAdmin from '../Components/NavigationAdmin';
import SobreNosotros from '@/Components/Sobrenosotros';
import Footer from '../Components/Footer';
import axios from 'axios';
import { Inertia } from '@inertiajs/inertia';

import { FaUser, FaCalendarAlt, FaMoneyBillWave, FaCreditCard, FaCashRegister } from "react-icons/fa";

export default function ControlGanancias() {
    const [mes, setMes] = useState(new Date().getMonth() + 1);
    const [año, setAño] = useState(new Date().getFullYear());
    const [barberoId, setBarberoId] = useState('');
    const [barberos, setBarberos] = useState([]);

    const [datos, setDatos] = useState({
        citas_realizadas: 0,
        ganancias_totales: 0,
        desglose: {
            adelantado: 0,
            tarjeta: 0,
            efectivo: 0
        }
    });

    const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const volver = () => {
        Inertia.visit('/mi-gestion-admin');
    };


    // Obtener la lista de barberos
    useEffect(() => {
        const obtenerBarberos = async () => {
            try {
                const response = await axios.get('/api/barberos');
                setBarberos(response.data);
            } catch (error) {
                Swal.fire('Error', 'No se pudieron cargar los barberos', 'error');
            }
        };
        obtenerBarberos();
    }, []);

    // Obtener los datos de ganancias del barbero seleccionado
    const obtenerDatos = async () => {
        try {
            const response = await axios.get('/api/ganancias-barbero', {
                params: { barbero_id: barberoId, mes, año }
            });
            setDatos(response.data);
        } catch (error) {
            Swal.fire('Error', 'No se pudieron cargar los datos', 'error');
        }
    };

    useEffect(() => {
        if (barberoId) obtenerDatos();
    }, [barberoId, mes, año]);

    return (
        <div
            className="foro-barberia"
            style={{
                backgroundImage: `url('/images/barberia.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '100vh',
                color: 'white',
            }}
        >
            <NavigationAdmin />
            <div className="container mx-auto py-16 px-6">
                <div className="bg-gray-900 bg-opacity-90 p-8 rounded-xl shadow-2xl">
                    <h2 className="text-4xl font-bold text-center text-white mb-6">💈 Ganancias de Barberos</h2>

                    {/* Filtros */}
                    <div className="flex justify-center gap-6 mb-8">
                        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                            <label className="text-lg font-semibold">✂️ Barbero:</label>
                            <select
                                value={barberoId}
                                onChange={(e) => setBarberoId(e.target.value)}
                                className="ml-2 p-2 rounded bg-gray-700 text-white focus:outline-none"
                            >
                                <option value="">Seleccionar</option>
                                {barberos.map(barbero => (
                                    <option key={barbero.id} value={barbero.id}>
                                        {barbero.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                            <label className="text-lg font-semibold">📆 Mes:</label>
                            <select
                                value={mes}
                                onChange={(e) => setMes(e.target.value)}
                                className="ml-2 p-2 rounded bg-gray-700 text-white focus:outline-none"
                            >
                                {meses.map((nombreMes, index) => (
                                    <option key={index + 1} value={index + 1}>
                                        {nombreMes}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                            <label className="text-lg font-semibold">📅 Año:</label>
                            <input
                                type="number"
                                value={año}
                                onChange={(e) => setAño(e.target.value)}
                                min="2000"
                                max={new Date().getFullYear()}
                                className="ml-2 p-2 rounded bg-gray-700 text-white focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Tarjetas de estadísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
                            <FaCalendarAlt className="text-yellow-400 text-4xl mb-2" />
                            <h2 className="text-xl font-bold">Citas Realizadas</h2>
                            <p className="text-3xl font-semibold">{datos.citas_realizadas}</p>
                        </div>
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
                            <FaMoneyBillWave className="text-green-400 text-4xl mb-2" />
                            <h2 className="text-xl font-bold">Ganancias Totales</h2>
                            <p className="text-3xl font-semibold">{datos.ganancias_totales} €</p>
                        </div>
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
                            <FaCashRegister className="text-blue-400 text-4xl mb-2" />
                            <h2 className="text-xl font-bold">Desglose de Pagos</h2>
                            <p className="text-lg">💳 Tarjeta: {datos.desglose.tarjeta} €</p>
                            <p className="text-lg">💰 Efectivo: {datos.desglose.efectivo} €</p>
                            <p className="text-lg">🌐 Adelantado: {datos.desglose.adelantado} €</p>
                        </div>
                    </div>
                    <br /><br />
                    <div className="flex justify-center mb-6">
                        <button
                            onClick={volver}
                            className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg flex items-center shadow-lg transition duration-300 ease-in-out"
                        >
                            ⬅️ Volver
                        </button>
                    </div>

                </div>


            </div>
            <SobreNosotros />
            <Footer />
        </div>
    );
}
