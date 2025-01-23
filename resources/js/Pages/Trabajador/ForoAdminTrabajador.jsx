import React from 'react';
import NavigationTrabajador from '../../Components/NavigationTrabajador';
import SobreNosotros from '@/Components/Sobrenosotros';
import Footer from '../../Components/Footer';
import ForoTrabajador from '../../Components/ForoTrabajador';

export default function ForoAdminTrabajador({ noticias }) {
    return (
        <div
            className="foro-barberia"
            style={{
                backgroundImage: `url('/images/barberia.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '100vh',
            }}
        >
            <NavigationTrabajador />
            <br /><br /><br />
            <ForoTrabajador noticias={noticias} />
            <br /><br />
            <SobreNosotros />
            <Footer />
        </div>
    );
}
