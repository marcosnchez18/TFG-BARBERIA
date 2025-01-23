import React from 'react';
import NavigationTrabajador from '../../Components/NavigationTrabajador';
import SobreNosotros from '@/Components/Sobrenosotros';
import Footer from '../../Components/Footer';
import GananciasTrabajador from '../../Components/GananciasTrabajador';

export default function GananciasPersonalesTrabajador() {
    return (
        <div
            className="foro-barberia"
            style={{
                backgroundImage: `url('/images/barberia.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '100vh',
                color: 'white',
            }}
        >
            <NavigationTrabajador />
            <GananciasTrabajador />
            <SobreNosotros />
            <Footer />
        </div>
    );
}
