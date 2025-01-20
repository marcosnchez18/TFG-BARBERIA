import React, { useState } from 'react';
import Footer from '../Components/Footer'; // Componente de footer
import { Link } from '@inertiajs/react';
import SobreNosotros from '@/Components/Sobrenosotros';
import WhatsAppButton from '@/Components/Wasa'
import '../../css/Barber.css'; // Estilos específicos
import Naviser from '@/Components/NavigationSer';

export default function Servi() {
    // Estado para gestionar el acordeón
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const services = [
        {
            title: 'El peinado',

            description: 'Nuestros cortes de pelo están diseñados para resaltar tu estilo único, cuidando cada detalle para asegurar que salgas luciendo perfecto.',
            image: '/images/bajo.jpg'
        },
        {
            title: 'El Brillo',

            description: 'Disfruta de un afeitado tradicional con navaja y espuma caliente, para una experiencia de barbería como ninguna otra.',
            image: '/images/x3.jpg'
        },
        {
            title: 'La Clase',

            description: 'Déjanos cuidar de tu barba con precisión y dedicación, logrando un estilo impecable que combine con tu look personal.',
            image: '/images/precio_fondo.jpg'
        },
        {
            title: 'La combinación',

            description: 'Un servicio completo que incluye corte de pelo y arreglo de barba, perfecto para quienes buscan un estilo definido.',
            image: '/images/ca2.png'
        },
        {
            title: 'El Estilo',

            description: 'Contamos con las técnicas más avanzadas para que tus cejas luzcan bien definidas y se ajusten a tu rostro.',
            image: '/images/ceja.png'
        },
        {
            title: 'La Limpieza',

            description: 'Nuestro servicio de lavado de cabello incluye un peinado a medida para que te sientas renovado y fresco.',
            image: '/images/peinado.png'
        },
        {
            title: 'La Textura',

            description: 'Devuelve la vitalidad a tu cabello con nuestro alisado de keratina, ideal para eliminar el frizz y mejorar la salud del cabello.',
            image: '/images/mujer.png'
        },
        {
            title: 'El Color',

            description: '¿Te gustaría darle un toque de color a tu cabello? Nuestras mechas están hechas con los mejores productos del mercado.',
            image: '/images/rojo.jpg'
        },
        {
            title: 'La Atracción',

            description: 'Un paquete completo que incluye corte de pelo, barba, cejas y lavado, perfecto para un cambio total de look.',
            image: '/images/ca4.png'
        }
    ];

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
        }
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navegación */}
            <Naviser />

            {/* Sección principal de servicios */}
            <section className="py-12 text-center">
                <h1 className="text-4xl font-bold mb-6" style={{ fontFamily: 'Times New Roman, serif' }}>
                    Nuestros Servicios
                </h1>
                <br/><br/><br/>

                {/* Lista de Servicios */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto max-w-6xl">
                    {services.map((service, index) => (
                        <div key={index} className="p-6 bg-white rounded shadow-md hover:scale-105 transition-transform duration-300">
                            <img src={service.image} alt={service.title} className="rounded-md mb-4 w-full h-48 object-cover" />
                            <h3 className="text-2xl font-semibold">{service.title}</h3>
                            <h4 className="text-xl text-ocre font-semibold mb-2">{service.price}</h4>
                            <p className="text-lg">{service.description}</p>
                        </div>
                    ))}

                </div>
                <br/><br/>
<Link href="/login" className="boton_lugar">
                    Reservar Cita
                </Link>


            </section>

            {/* Acordeón de Preguntas Frecuentes */}
            <section className="py-12 bg-gray-200">
                <h2 className="text-3xl font-bold text-center mb-8" style={{ fontFamily: 'Times New Roman, serif' }}>
                    Preguntas Frecuentes
                </h2>
                <div className="max-w-4xl mx-auto">
                    {faqItems.map((item, index) => (
                        <div key={index} className="mb-4">
                            <button
                                className="w-full text-left bg-white py-4 px-6 rounded shadow-md focus:outline-none"
                                onClick={() => toggleFAQ(index)}
                            >
                                <h3 className="text-xl font-semibold">{item.question}</h3>
                            </button>
                            {openIndex === index && (
                                <div className="bg-white px-6 py-4 text-gray-700 border-t">
                                    <p>{item.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            <SobreNosotros/>
            <Footer />
            <WhatsAppButton />

        </div>
    );
}
