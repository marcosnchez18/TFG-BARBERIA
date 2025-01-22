import React from 'react';
import { usePage } from '@inertiajs/react';
import NavigationCliente from '../../Components/NavigationCliente';
import WhatsAppButton from '@/Components/Wasa';
import SobreNosotros from '@/Components/Sobrenosotros';
import Footer from '../../Components/Footer';
import MisDatos from '../../Components/MisDatos';

export default function MisDatosCliente() {
    const { cliente } = usePage().props;

    return (
        <div>
            <NavigationCliente />
            <div
                style={{
                    backgroundImage: `url('/images/barberia.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '100vh',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <br /><br /><br /><br />
                <MisDatos cliente={cliente} />
            </div>
            <SobreNosotros />
            <Footer />
            <WhatsAppButton />
        </div>
    );
}
