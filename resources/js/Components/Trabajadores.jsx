import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Trabajadores() {
    const [trabajadores, setTrabajadores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Obtener los trabajadores desde la API
        axios.get('/trabajadores-fotos')
            .then(response => {
                setTrabajadores(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Hubo un problema al cargar los trabajadores.');
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p className="text-center">Cargando...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto max-w-6xl">
            {trabajadores.map((trabajador) => (
                <div
                    key={trabajador.id}
                    className="bg-gray-100 p-8 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                >
                    <img
  src={`/storage/${trabajador.imagen}`}
  alt={trabajador.nombre}
  className="barbero-img mx-auto mb-4 hover:opacity-80"
/>


                    <h3 className="text-2xl font-bold text-center">{trabajador.nombre}</h3>
                </div>
            ))}
        </div>
    );
}
