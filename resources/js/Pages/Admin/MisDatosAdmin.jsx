import { usePage } from '@inertiajs/react';

import React from 'react';

import NavigationAdmin from '../../Components/NavigationAdmin';
import DatosAdmin from '../../Components/DatosAdmin';
import SobreNosotros from '@/Components/Sobrenosotros';
import Footer from '../../Components/Footer';
import WhatsAppButton from '@/Components/Wasa';

export default function MisDatosAdmin() {
    const { admin } = usePage().props;

    return (
        <div>
            <NavigationAdmin />
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
                <DatosAdmin admin={admin} />
            </div>
            <SobreNosotros />
            <Footer />
            <WhatsAppButton />
        </div>
    );
}
