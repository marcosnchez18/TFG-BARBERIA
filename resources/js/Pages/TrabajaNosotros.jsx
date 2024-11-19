import React from 'react';
import Footer from '../Components/Footer';
import Localizacion from '../Components/Localizacion';
import SobreNosotros from '../Components/Sobrenosotros';
import '../../css/Barber.css'; // Asegúrate de tener este archivo CSS
import NavigationTrab from '@/Components/NavigationTrab';
import WhatsAppButton from '@/Components/Wasa'

export default function Trabaja() {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navegación */}
            <NavigationTrab />

            {/* Sección de contacto */}
            <section className="py-12 bg-white text-center">
                <div className="container mx-auto">

                </div>
            </section>

            <Localizacion />
            <SobreNosotros />

            {/* Footer */}
            <Footer />
            <WhatsAppButton />
        </div>
    );
}
