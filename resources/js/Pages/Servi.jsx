import React from 'react';
import Footer from '../Components/Footer';
import SobreNosotros from '@/Components/Sobrenosotros';
import WhatsAppButton from '@/Components/Wasa';
import '../../css/Barber.css';
import Naviser from '@/Components/NavigationSer';
import Caracteristicas from '../Components/Caracteristicas';
import Acordeon from '../Components/Acordeon';

export default function Servi() {
    const faqItems = [
        {
            question: '¿Qué debo hacer para reservar una cita?',
            answer: 'Puedes reservar una cita a través de nuestra página web www.barbers18sanlucar.com',
        },
        {
            question: '¿Cuáles son los métodos de pago aceptados?',
            answer: 'Aceptamos pagos en efectivo y PayPal.',
        },
        {
            question: '¿Cuál es el horario de atención?',
            answer: 'Estamos abiertos de lunes a viernes de 10:00 a 20:00. Sábados de 10:00 a 14:00. Cerramos domingos y festivos.',
        },
        {
            question: '¿Se necesita cita previa?',
            answer: 'Sí, solo se atendrá a clientes cuya cita haya sido reservada a través de la web.',
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <Naviser />

            {/* Usar el componente Caracteristicas */}
            <Caracteristicas />

            {/* Usar el componente Acordeon */}
            <Acordeon items={faqItems} />

            <SobreNosotros />
            <Footer />
            <WhatsAppButton />
        </div>
    );
}
