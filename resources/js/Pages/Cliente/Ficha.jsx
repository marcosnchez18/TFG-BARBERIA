import React from 'react';
import NavigationCliente from '../../Components/NavigationCliente';
import WhatsAppButton from '@/Components/Wasa';
import SobreNosotros from '@/Components/Sobrenosotros';
import Footer from '../../Components/Footer';
import DocFicha from '../../Components/DocFicha';

export default function MiFicha({ ficha, user }) {
    return (
        <div
            style={{
                backgroundImage: "url('/images/barberia.jpg')",
                fontFamily: "New Times Roman",
            }}
        >
            <NavigationCliente />
            <div>
                <DocFicha ficha={ficha} user={user} />
            </div>
            <SobreNosotros />
            <Footer />
            <WhatsAppButton />
        </div>
    );
}
