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
        <section
            id="services"
            className="py-12 bg-dark-brown text-center"
            style={{ fontFamily: 'Times New Roman, serif' }}
            itemScope
            itemType="https://schema.org/LocalBusiness"
        >
            {/* Información del Negocio */}
            <meta itemProp="name" content="Barber's18" />
            <meta itemProp="description" content="Los mejores servicios de barbería en tu ciudad. Corta, afeita y estiliza con los mejores profesionales." />
            <meta itemProp="address" content="Calle Cristobal Colón,20 Cádiz, España" />
            <meta itemProp="telephone" content="+34 622541527" />
            <meta itemProp="priceRange" content="€€" />

            <div className="container mx-auto">
                <h2 className="text-3xl font-bold mb-4 text-white">
                    Nuestros Servicios
                </h2>
                <br /><br /><br /><br /><br />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {servicios.length > 0 ? (
                        servicios.map((servicio) => (
                            <div
                                key={servicio.id}
                                className="p-6 bg-gray-100 rounded-lg shadow-md servicio-container transition duration-300 hover:shadow-xl hover:bg-gray-200 relative group"
                                itemScope
                                itemType="https://schema.org/Service"
                            >
                                <h3 className="text-xl font-semibold mb-2" itemProp="name">{servicio.nombre}</h3>
                                <h3 className="text-lg font-semibold mb-2 ocre-text" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                                    <span itemProp="price">{servicio.precio}</span>€
                                </h3>
                                {/* Descripción oculta por defecto y visible en hover */}
                                <p className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 text-white text-sm px-4 py-2 rounded-md opacity-0 transition-opacity duration-300 group-hover:opacity-100" itemProp="description">
                                    {servicio.descripcion}
                                </p>
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
