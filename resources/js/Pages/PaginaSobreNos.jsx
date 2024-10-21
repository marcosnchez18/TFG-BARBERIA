import React from 'react';
import NavigationResto from '../Components/NavigationResto';
import WhatsAppButton from '@/Components/Wasa'; // Componente del botón flotante de WhatsApp
import SobreNosotros from '@/Components/Sobrenosotros';
import Footer from '../Components/Footer';
import NuestraHistoria from '@/Components/Historia';
import VideoBarber from '@/Components/Video';

export default function Welcome() {
    return (
        <div>
            {/* Barra de navegación */}
            <NavigationResto />
            <NuestraHistoria/>
            <VideoBarber/>




            <SobreNosotros />

            {/* Footer */}
            <Footer />

            {/* Botón flotante de WhatsApp */}
            <WhatsAppButton />
        </div>
    );
}
