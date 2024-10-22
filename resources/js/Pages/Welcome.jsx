import React from 'react';
import Navigation from '../Components/Navigation';
import Header from '../Components/Header';
import Triangulo from '@/Components/Triangulo';
import Servicios from '@/Components/Servicios';
import Infobarber from '@/Components/Infobarber';
import LogosServicios from '@/Components/Logosservicios';
import FinHome from '@/Components/Cortespelo';
import Localizacion from '@/Components/Localizacion';
import WhatsAppButton from '@/Components/Wasa'; 
import SobreNosotros from '@/Components/Sobrenosotros';
import Footer from '../Components/Footer';

export default function Welcome() {
    return (
        <div>
            <Navigation />
            <Header />
            <Triangulo />
            <Infobarber />
            <LogosServicios />
            <br /><br /><br /><br />
            <Servicios />
            <FinHome />
            <Localizacion />
            <SobreNosotros />
            <Footer />
            <WhatsAppButton />
        </div>
    );
}
