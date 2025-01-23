import React, { useState } from 'react';
import axios from 'axios';

export default function ConsultarEstadoCandidatura() {
    const [localizador, setLocalizador] = useState('');
    const [estado, setEstado] = useState(null);
    const [mensajeEstado, setMensajeEstado] = useState('');

    const handleConsultarEstado = async () => {
        try {
            const response = await axios.post('/consultar-estado', { localizador });
            const { estado } = response.data;
            setEstado(estado);

            // Mensaje personalizado según el estado
            let mensaje = '';
            switch (estado) {
                case 'entregado':
                    mensaje = '¡Tu candidatura ha sido entregada exitosamente! Estamos revisando tu perfil.';
                    break;
                case 'denegado':
                    mensaje = 'Lamentablemente, tu candidatura no ha sido seleccionada. Te animamos a seguir participando en nuestras ofertas futuras.';
                    break;
                case 'en bolsa de empleo':
                    mensaje = 'Tu perfil ha sido añadido a nuestra bolsa de empleo. ¡Recuerda estar atento a tu móvil y correo electrónico por si te contactamos para ofrecerte una entrevista!';
                    break;
                default:
                    mensaje = 'Estado desconocido. Por favor, verifica tu localizador.';
            }
            setMensajeEstado(mensaje);
        } catch (error) {
            setEstado('error');
            setMensajeEstado('No se encontró ninguna candidatura con el localizador proporcionado. Por favor, verifica el código e inténtalo de nuevo.');
        }
    };

    return (
        <section className="py-12 bg-gradient-to-r from-blue-100 to-gray-100 rounded-lg shadow-lg mx-6" id="consultar-estado">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl font-extrabold text-blue-800 mb-6">
                    Consulta el estado de tu candidatura
                </h2>
                <p className="text-lg text-gray-700 mb-6">
                    Introduce tu localizador para conocer el estado de tu candidatura.
                </p>
                <div className="flex flex-col items-center">
                    <input
                        type="text"
                        value={localizador}
                        onChange={(e) => setLocalizador(e.target.value)}
                        className="border-2 border-blue-500 rounded-lg p-4 w-full max-w-lg text-gray-700 shadow-md focus:ring-2 focus:ring-blue-300 focus:outline-none"
                        placeholder="Introduce tu localizador"
                    />
                    <button
                        onClick={handleConsultarEstado}
                        className="mt-6 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-3 rounded-full shadow-lg transform hover:scale-105 transition duration-300 font-bold"
                    >
                        Consultar Estado
                    </button>
                </div>
                {estado && (
                    <div className="mt-10 py-10 px-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl shadow-xl border-4 border-green-500">
                        <h3 className="text-3xl font-extrabold text-green-800 mb-4">
                            Estado de tu candidatura:
                        </h3>
                        <p className="text-xl text-gray-800 mb-6">
                            <span className="font-bold text-blue-600 bg-white px-4 py-2 rounded-lg shadow-lg">
                                {estado}
                            </span>
                        </p>
                        <p className="text-lg text-gray-700 mt-4">{mensajeEstado}</p>
                    </div>
                )}
            </div>
        </section>
    );
}
