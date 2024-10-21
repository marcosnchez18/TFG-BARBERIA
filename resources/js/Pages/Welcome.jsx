import React from 'react';
import Navigation from '../Components/Navigation'; // Asegúrate de que la ruta sea correcta
import Header from '../Components/Header'; // Asegúrate de que la ruta sea correcta
import Triangulo from '@/Components/Triangulo';
import Servicios from '@/Components/Servicios';
import Infobarber from '@/Components/Infobarber';
import LogosServicios from '@/Components/Logosservicios';
import FinHome from '@/Components/Cortespelo';
import Localizacion from '@/Components/Localizacion';
import WhatsAppButton from '@/Components/Wasa'; // Componente del botón flotante de WhatsApp
import SobreNosotros from '@/Components/Sobrenosotros';
import Footer from '../Components/Footer'; // Asegúrate de que la ruta sea correcta

export default function Welcome() {
    return (
        <div>
            {/* Barra de navegación */}
            <Navigation />

            {/* Sección de bienvenida */}
            <Header />
            <Triangulo />
            <Infobarber />
            <LogosServicios />
            <br /><br /><br /><br />
            <Servicios />
            <FinHome />
            <Localizacion />
            <SobreNosotros />

            {/* Footer */}
            <Footer />

            {/* Botón flotante de WhatsApp */}
            <WhatsAppButton />
        </div>
    );
}
