import React from 'react';
import Footer from '../Components/Footer';
import Localizacion from '../Components/Localizacion';
import SobreNosotros from '../Components/Sobrenosotros';
import '../../css/Barber.css';
import Naviser from '@/Components/NavigationSer';
import WhatsAppButton from '@/Components/Wasa';
import Ubicacion from '../Components/Ubicacion'; // Importar el componente

export default function Contacto() {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navegación */}
            <Naviser />

            {/* Sección de contacto */}
            <Ubicacion /> {/* Usar el componente extraído */}

            <Localizacion />
            <SobreNosotros />

            {/* Footer */}
            <Footer />
            <WhatsAppButton />
        </div>
    );
}
