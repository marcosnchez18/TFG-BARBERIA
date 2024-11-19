import React from 'react';
import Footer from '../Components/Footer';
import Localizacion from '../Components/Localizacion';
import SobreNosotros from '../Components/Sobrenosotros';
import '../../css/Barber.css'; // Asegúrate de tener este archivo CSS
import NavigationTrab from '@/Components/NavigationTrab';
import WhatsAppButton from '@/Components/Wasa';

export default function Trabaja({ ofertas }) {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navegación */}
            <NavigationTrab />

            {/* Hero Section */}
            <section
                className="py-20 text-center text-black"

            >
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold mb-4">
                        ¡Únete a nuestro equipo!
                    </h2>
                    <p className="text-lg max-w-3xl mx-auto">
                        En nuestra empresa, valoramos el talento, la creatividad y el compromiso. Buscamos personas
                        apasionadas que quieran crecer con nosotros y marcar la diferencia.
                    </p>
                </div>
            </section>

            {/* Beneficios de trabajar con nosotros */}
            <section className="py-12 bg-white text-center">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800">
                        ¿Por qué trabajar con nosotros?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-bold text-gray-700 mb-3">
                                Ambiente dinámico
                            </h3>
                            <p className="text-gray-600">
                                Formarás parte de un equipo vibrante, innovador y lleno de energía.
                            </p>
                        </div>
                        <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-bold text-gray-700 mb-3">
                                Crecimiento profesional
                            </h3>
                            <p className="text-gray-600">
                                Oportunidades de desarrollo personal y profesional con formación continua.
                            </p>
                        </div>
                        <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-bold text-gray-700 mb-3">
                                Beneficios competitivos
                            </h3>
                            <p className="text-gray-600">
                                Ofrecemos salarios competitivos y otros incentivos únicos en el mercado.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Ofertas publicadas */}
            <section className="py-12 bg-gray-100">
    <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Ofertas de Empleo Disponibles
        </h2>
        {ofertas && ofertas.length > 0 ? (
            <div
                className={`grid ${
                    ofertas.length === 1
                        ? 'justify-center'
                        : ofertas.length === 2
                        ? 'grid-cols-2'
                        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                } gap-8`}
            >
                {ofertas.map((oferta) => (
                    <div
                        key={oferta.id}
                        className="bg-white p-6 rounded-lg shadow-lg"
                    >
                        <h3 className="text-xl font-bold text-gray-700 mb-3">
                            {oferta.nombre}
                        </h3>
                        <p className="text-gray-600">{oferta.descripcion}</p>
                        <ul className="mt-4 text-sm text-gray-600">
                            <li>Duración: {oferta.duracion_meses} meses</li>
                            <li>Vacantes: {oferta.numero_vacantes}</li>
                            <li>Máximo Inscripciones: {oferta.inscripciones_maximas}</li>
                        </ul>
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

            <section className="py-12 bg-white text-center">

            </section>


            {/* Localización y otros componentes */}
            <Localizacion />
            <SobreNosotros />

            {/* Footer */}
            <Footer />
            <WhatsAppButton />
        </div>
    );
}
