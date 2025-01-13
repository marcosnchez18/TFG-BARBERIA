import React from 'react';
import '../../css/Barber.css';
import Footer from '../Components/Footer';
import { Link } from '@inertiajs/react';
import Navieq from '@/Components/NavigationEq';
import LogosServicios from '@/Components/Logosservicios';
import SobreNosotros from '@/Components/Sobrenosotros';
import WhatsAppButton from '@/Components/Wasa';

export default function Equipo() {
    return (
        <div className="min-h-screen bg-gray-100" itemScope itemType="https://schema.org/LocalBusiness">
            {/* Información del negocio */}
            <meta itemProp="name" content="Barber's18" />
            <meta itemProp="description" content="Nuestro equipo de expertos barberos ofrece cortes de alta calidad, afeitados y estilismo profesional en Barber's18." />
            <meta itemProp="address" content="C/ Cristobal Colón, 20, Sanlúcar de Bda, Cádiz, España" />
            <meta itemProp="telephone" content="+34 622541527" />
            <meta itemProp="priceRange" content="€€" />

            {/* Navegación */}
            <Navieq />

            {/* Sección del equipo */}
            <section className="py-12 bg-white text-center">
                <h2 className="text-4xl font-bold mb-6 equipo-title" itemProp="department" itemScope itemType="https://schema.org/Organization">
                    <span itemProp="name">Nuestro Equipo</span>
                </h2>
                <p className="text-lg mb-12 equipo-description" itemProp="description">
                    Conoce a nuestros talentosos barberos, apasionados por su trabajo y siempre listos para ofrecer el mejor servicio.
                </p>

                {/* Barberos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto max-w-6xl">
                    {/* Barbero 1: Daniel Valle Vargas */}
                    <div className="barbero-container bg-gray-100 p-8 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                        itemScope itemType="https://schema.org/Person">
                        <Link href="/daniel">
                            <img src="/images/hector.png" alt="Daniel Valle Vargas" className="barbero-img mx-auto mb-4 hover:opacity-80" itemProp="image" />
                            <h3 className="text-2xl font-bold mb-4" itemProp="name">Daniel Valle Vargas</h3>
                        </Link>
                        <div className="flex justify-center space-x-4">
                            <a href="https://www.instagram.com/danyvrgas" target="_blank" rel="noopener noreferrer" itemProp="sameAs">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" className="w-8 h-8" />
                            </a>
                            <a href="https://www.facebook.com/danyvrgas" target="_blank" rel="noopener noreferrer" itemProp="sameAs">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" className="w-8 h-8" />
                            </a>
                        </div>
                    </div>

                    {/* Barbero 2: José Ángel Sánchez Harana */}
                    <div className="barbero-container bg-gray-100 p-8 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                        itemScope itemType="https://schema.org/Person">
                        <Link href="/jose">
                            <img src="/images/jose.png" alt="José Ángel Sánchez Harana" className="barbero-img mx-auto mb-4 hover:opacity-80" itemProp="image" />
                            <h3 className="text-2xl font-bold mb-4" itemProp="name">José Ángel Sánchez Harana</h3>
                        </Link>
                        <div className="flex justify-center space-x-4">
                            <a href="https://www.instagram.com/marcosnchez18" target="_blank" rel="noopener noreferrer" itemProp="sameAs">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" className="w-8 h-8" />
                            </a>
                            <a href="https://www.facebook.com/marcosnchez18" target="_blank" rel="noopener noreferrer" itemProp="sameAs">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" className="w-8 h-8" />
                            </a>
                        </div>
                    </div>
                </div>

                <br /><br />
                <Link href="/login" className="boton_lugar" itemProp="potentialAction" itemScope itemType="https://schema.org/ReserveAction">
                    <span itemProp="name">Reservar Cita</span>
                </Link>
            </section>

            <LogosServicios />
            <SobreNosotros />
            <Footer />
            <WhatsAppButton />
        </div>
    );
}
