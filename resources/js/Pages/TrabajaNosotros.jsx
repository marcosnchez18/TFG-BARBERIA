import React, { useState } from 'react';
import axios from 'axios';
import Footer from '../Components/Footer';
import Localizacion from '../Components/Localizacion';
import SobreNosotros from '../Components/Sobrenosotros';
import OfertasPublicas from '../Components/OfertasPublicas';
import '../../css/Barber.css';
import NavigationTrab from '@/Components/NavigationTrab';
import ConsultarEstadoCandidatura from '../Components/ConsultarEstadoCandidatura';

import WhatsAppButton from '@/Components/Wasa';

export default function Trabaja({ ofertas }) {
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
        <div className="min-h-screen bg-gray-100">
            {/* Navegación */}
            <NavigationTrab />

            {/* Hero Section */}
            <section className="py-20 bg-gradient-to-b from-brown-900 via-gray-800 to-gray-700 text-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-5xl font-extrabold text-amber-500 mb-6">
                        ¡Únete a Nuestro Equipo!
                    </h2>
                    <p className="text-lg max-w-2xl mx-auto mb-10 text-black">
                        En nuestra empresa, valoramos el <strong className="text-amber-400">talento</strong>, la <strong className="text-amber-400">creatividad</strong> y el <strong className="text-amber-400">compromiso</strong>. Buscamos personas apasionadas que quieran crecer con nosotros y marcar la diferencia.
                    </p>

                    <div className="relative group">
                        <img
                            src="/images/trabaja.jpeg"
                            alt="Únete a nuestro equipo"
                            className="mx-auto rounded-lg shadow-lg w-full max-w-lg transform group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                            <p className="text-xl font-semibold text-amber-400">
                                ¡Haz que tu próximo gran paso sea con nosotros!
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 flex justify-center space-x-4">
                        <a
                            href="/register"
                            className="px-8 py-3 bg-amber-500 text-black font-semibold rounded-full shadow-md hover:bg-amber-600 transition-colors"
                            style={{ fontFamily: 'Times New Roman' }}
                        >
                            Regístrate
                        </a>
                        <a
                            href="/contacto"
                            className="px-8 py-3 bg-gray-700 text-amber-400 font-semibold rounded-full shadow-md hover:bg-gray-600 transition-colors"
                            style={{ fontFamily: 'Times New Roman' }}
                        >
                            Contáctanos
                        </a>
                    </div>
                </div>
            </section>


            {/* Ofertas publicadas */}
            <OfertasPublicas ofertas={ofertas} />


            <ConsultarEstadoCandidatura />

            <br /><br /><br />


            {/* Beneficios de trabajar con nosotros */}
            <section className="py-12 bg-white text-center">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800">
                        ¿Por qué trabajar con nosotros?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-bold text-gray-700 mb-3">Ambiente dinámico</h3>
                            <p className="text-gray-600">
                                Formarás parte de un equipo vibrante, innovador y lleno de energía.
                            </p>
                        </div>
                        <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-bold text-gray-700 mb-3">Crecimiento profesional</h3>
                            <p className="text-gray-600">
                                Oportunidades de desarrollo personal y profesional con formación continua.
                            </p>
                        </div>
                        <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-bold text-gray-700 mb-3">Beneficios competitivos</h3>
                            <p className="text-gray-600">
                                Ofrecemos salarios competitivos y otros incentivos únicos en el mercado.
                            </p>
                        </div>
                    </div>
                </div>
                <br /><br />
            </section>
            <br /><br /><br /><br />

            {/* Componentes adicionales */}
            <Localizacion />
            <SobreNosotros />
            <Footer />
            <WhatsAppButton />
        </div>
    );
}
