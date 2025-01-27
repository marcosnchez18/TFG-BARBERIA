import React from 'react';
import { usePage } from '@inertiajs/react'; // Importación correcta
import Swal from 'sweetalert2';
import NavigationCliente from '../../Components/NavigationCliente';
import WhatsAppButton from '@/Components/Wasa';
import SobreNosotros from '@/Components/Sobrenosotros';
import Footer from '../../Components/Footer';
import InicioCliente from '../../Components/InicioCliente'; // Ajustar la ruta según tu estructura

export default function ClienteInicio() {
    const { user } = usePage().props; 

    return (
        <div
            style={{
                backgroundImage: `url('/images/barberia.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
                backgroundAttachment: 'fixed',
            }}
        >
            <NavigationCliente />
            <InicioCliente user={user} />
            <br /><br />
            <SobreNosotros />
            <Footer />
            <WhatsAppButton />
        </div>
    );
}
