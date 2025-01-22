import React from 'react';
import NavigationCliente from '../../Components/NavigationCliente';
import WhatsAppButton from '@/Components/Wasa';
import SobreNosotros from '@/Components/Sobrenosotros';
import Footer from '../../Components/Footer';
import { Inertia } from '@inertiajs/inertia';
import '../../../css/Barber.css';
import Noticias from '../../Components/Noticias'; // Importa el nuevo componente de noticias

export default function ReservarCitaCliente({ noticias }) {
    return (
        <div
            style={{
                backgroundImage: "url('/images/barberia.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
            }}
        >
            <NavigationCliente />
            <br />
            <div className="container mx-auto p-8 bg-white bg-opacity-80 rounded-lg mt-10">
                <h2 className="text-4xl font-bold text-center mb-6">Noticias</h2>


                <Noticias noticias={noticias} />

                {/* Botón para pedir cita */}
                <div className="text-center mt-10">
                    <button
                        onClick={() => Inertia.visit(route('mis-citas-elegir'))}
                        className="boton_lugar"
                    >
                        Pedir Cita
                    </button>
                </div>
            </div>
            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
            <SobreNosotros />
            <Footer />
            <WhatsAppButton />
        </div>
    );
}
