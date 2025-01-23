import React from 'react';
import NavigationAdmin from '../../Components/NavigationAdmin';
import SobreNosotros from '@/Components/Sobrenosotros';
import Footer from '../../Components/Footer';
import AdministradorCitas from '../../Components/AdministradorCitas';

export default function CitasAdmin() {
    return (
        <div
            className="admin-dashboard bg-cover bg-center min-h-screen"
            style={{
                backgroundImage: `url('/images/barberia.jpg')`,
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed',
            }}
        >
            <NavigationAdmin />
            <AdministradorCitas />
            <br /><br /><br /><br /><br /><br /><br /><br />
            <SobreNosotros />
            <Footer />
        </div>
    );
}
