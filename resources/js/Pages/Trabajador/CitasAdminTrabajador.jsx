import React from 'react';
import NavigationTrabajador from '../../Components/NavigationTrabajador';
import SobreNosotros from '@/Components/Sobrenosotros';
import Footer from '../../Components/Footer';
import TrabajadorCitas from '../../Components/TrabajadorCitas';

export default function CitasAdminTrabajador() {
    return (
        <div
            className="admin-dashboard bg-cover bg-center min-h-screen"
            style={{
                backgroundImage: `url('/images/barberia.jpg')`,
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed',
            }}
        >
            <NavigationTrabajador />
            <div className="container mx-auto py-12">
                <TrabajadorCitas />
            </div>
            <SobreNosotros />
            <Footer />
        </div>
    );
}
