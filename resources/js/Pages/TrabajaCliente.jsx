import React, { useState } from 'react';
import axios from 'axios';
import Footer from '../Components/Footer';
import Localizacion from '../Components/Localizacion';
import SobreNosotros from '../Components/Sobrenosotros';
import '../../css/Barber.css';
import NavigationCliente from '@/Components/NavigationCliente';
import WhatsAppButton from '@/Components/Wasa';

export default function TrabajaCliente({ ofertas }) {
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
            <NavigationCliente />

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

                </div>
            </section>


            {/* Ofertas publicadas */}
            <section className="py-12 bg-white">
                <div className="container mx-auto px-6">
                    <h2 className="text-5xl font-extrabold mb-8 text-center text-blue-900">
                        Ofertas de Empleo Disponibles
                    </h2>

                    {ofertas && ofertas.length > 0 ? (
                        <div
                            className={`grid ${ofertas.length === 1
                                    ? 'justify-center'
                                    : ofertas.length === 2
                                        ? 'grid-cols-2'
                                        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                                } gap-8`}
                        >
                            {ofertas.map((oferta) => (
                                <div key={oferta.id} className="bg-white p-6 rounded-lg shadow-lg">
                                    <h3 className="text-xl font-bold text-gray-700 mb-3">
                                        {oferta.nombre}
                                    </h3>
                                    <p className="text-gray-600">
                                        {oferta.descripcion.split(' ').map((word, index) =>
                                            ['experiencia', 'barbero', 'temporada'].includes(word.toLowerCase()) ? (
                                                <strong key={index}>{word} </strong>
                                            ) : (
                                                `${word} `
                                            )
                                        )}
                                    </p>
                                    <ul className="mt-4 text-sm text-gray-600">
                                        <li>
                                            <strong>Duración:</strong> {oferta.duracion_meses} meses
                                        </li>
                                        <li>
                                            <strong>Vacantes:</strong> {oferta.numero_vacantes}
                                        </li>

                                    </ul>
                                    <button
                                        onClick={() => window.open(`/inscribirsecliente/${oferta.id}`, '_blank')}
                                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        Inscribirse
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-600">
                            Actualmente no hay ofertas disponibles. Vuelve pronto.
                        </p>
                    )}
                </div>
            </section>

            {/* Consultar estado por localizador */}
            <section className="py-12 bg-gradient-to-r from-blue-100 to-gray-100 rounded-lg shadow-lg mx-6" id="consultar-estado">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-extrabold text-blue-800 mb-6">
                        Consulta el estado de tu candidatura
                    </h2>
                    <div className="mt-8">

                        <button
                            type="button"
                            onClick={() => {
                                window.open('/miempleo', '_blank');
                            }}
                            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition transform duration-300 font-bold"
                        >
                            Ver mis candidaturas
                        </button>
                    </div>
                </div>
            </section>
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
