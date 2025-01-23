import React from 'react';
import NavigationTrabajador from '../../Components/NavigationTrabajador';
import SobreNosotros from '@/Components/Sobrenosotros';
import Footer from '../../Components/Footer';
import DatosTrabajador from '@/Components/DatosTrabajador';

export default function MisDatosAdminTrabajador({ trabajador }) {
    return (
        <div>
            <NavigationTrabajador />
            <div
                style={{
                    backgroundImage: `url('/images/barberia.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                }}
            >
                <DatosTrabajador trabajador={trabajador} />
            </div>
            <SobreNosotros />
            <Footer />
        </div>
    );
}
