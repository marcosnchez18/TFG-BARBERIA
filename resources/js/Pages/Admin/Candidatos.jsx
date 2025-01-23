import React from 'react';
import NavigationAdmin from '../../Components/NavigationAdmin';
import SobreNosotros from '@/Components/Sobrenosotros';
import Footer from '../../Components/Footer';
import Aspirantes from '../../Components/Aspirantes';

export default function Candidatos({ candidaturas }) {
    return (
        <div
            style={{
                backgroundImage: `url('/images/barberia.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
            }}
        >
            <NavigationAdmin />
            <br /><br /><br />
            <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-7xl mx-auto">
                <h2 className="text-4xl text-center font-bold text-gray-800 mb-6">Candidaturas de la Oferta</h2>
                <Aspirantes candidaturas={candidaturas} />
            </div>
            <br /><br /><br /><br />
            <SobreNosotros />
            <Footer />
        </div>
    );
}
