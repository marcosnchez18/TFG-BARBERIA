import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/Barber.css'; 

export default function Servicios() {
    const [servicios, setServicios] = useState([]);

    useEffect(() => {
        const fetchServicios = async () => {
            try {
                const response = await axios.get('/api/public/servicios');
                setServicios(response.data);
            } catch (error) {
                console.error('Error al obtener los servicios:', error);
            }
        };

        fetchServicios();
    }, []);

    return (
        <section id="services" className="py-12 bg-dark-brown text-center" style={{ fontFamily: 'Times New Roman, serif' }}>
            <div className="container mx-auto">
                <h2 className="text-3xl font-bold mb-4 text-white">Nuestros Servicios</h2>
                <br /><br /><br /><br /><br />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {servicios.length > 0 ? (
                        servicios.map((servicio) => (
                            <div key={servicio.id} className="p-4 bg-gray-100 rounded-md shadow-md servicio-container">
                                <h3 className="text-xl font-semibold mb-2">{servicio.nombre}</h3>
                                <h3 className="text-xl font-semibold mb-2 ocre-text">{servicio.precio}€</h3>
                                <p>{servicio.descripcion}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-white col-span-3">Cargando servicios...</p>
                    )}
                </div>
            </div>
            <br /><br /><br /><br />
        </section>
    );
}
