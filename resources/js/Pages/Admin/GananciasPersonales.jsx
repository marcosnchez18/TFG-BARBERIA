import React from 'react';
import NavigationAdmin from '../../Components/NavigationAdmin';
import SobreNosotros from '@/Components/Sobrenosotros';
import Footer from '../../Components/Footer';
import GananciasAdmin from '../../Components/GananciasAdmin';

export default function ControlGanancias() {
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
            <NavigationAdmin />
            <div className="container mx-auto py-16 px-6">
                <GananciasAdmin />
            </div>
            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
            <SobreNosotros />
            <Footer />
        </div>
    );
}
