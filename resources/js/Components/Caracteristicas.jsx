import React from 'react';

export default function Caracteristicas() {
    const services = [
        {
            title: 'El peinado',
            description: 'Nuestros cortes de pelo están diseñados para resaltar tu estilo único, cuidando cada detalle para asegurar que salgas luciendo perfecto.',
            image: '/images/bajo.jpg',
        },
        {
            title: 'El Brillo',
            description: 'Disfruta de un afeitado tradicional con navaja y espuma caliente, para una experiencia de barbería como ninguna otra.',
            image: '/images/x3.jpg',
        },
        {
            title: 'La Clase',
            description: 'Déjanos cuidar de tu barba con precisión y dedicación, logrando un estilo impecable que combine con tu look personal.',
            image: '/images/precio_fondo.jpg',
        },
        {
            title: 'La combinación',
            description: 'Un servicio completo que incluye corte de pelo y arreglo de barba, perfecto para quienes buscan un estilo definido.',
            image: '/images/ca2.png',
        },
        {
            title: 'El Estilo',
            description: 'Contamos con las técnicas más avanzadas para que tus cejas luzcan bien definidas y se ajusten a tu rostro.',
            image: '/images/ceja.png',
        },
        {
            title: 'La Limpieza',
            description: 'Nuestro servicio de lavado de cabello incluye un peinado a medida para que te sientas renovado y fresco.',
            image: '/images/peinado.png',
        },
        {
            title: 'La Textura',
            description: 'Devuelve la vitalidad a tu cabello con nuestro alisado de keratina, ideal para eliminar el frizz y mejorar la salud del cabello.',
            image: '/images/mujer.png',
        },
        {
            title: 'El Color',
            description: '¿Te gustaría darle un toque de color a tu cabello? Nuestras mechas están hechas con los mejores productos del mercado.',
            image: '/images/rojo.jpg',
        },
        {
            title: 'La Atracción',
            description: 'Un paquete completo que incluye corte de pelo, barba, cejas y lavado, perfecto para un cambio total de look.',
            image: '/images/ca4.png',
        },
    ];

    return (
        <section className="py-12 text-center">
            <h1 className="text-4xl font-bold mb-6" style={{ fontFamily: 'Times New Roman, serif' }}>
                Nuestros Servicios
            </h1>
            <br />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto max-w-6xl">
                {services.map((service, index) => (
                    <div
                        key={index}
                        className="p-6 bg-white rounded shadow-md hover:scale-105 transition-transform duration-300"
                    >
                        <img
                            src={service.image}
                            alt={service.title}
                            className="rounded-md mb-4 w-full h-48 object-cover"
                        />
                        <h3 className="text-2xl font-semibold">{service.title}</h3>
                        <p className="text-lg">{service.description}</p>
                    </div>
                ))}
            </div>
            <br />
            <a
                href="/login"
                className="boton_lugar mt-8 inline-block bg-blue-500 text-white px-8 py-3 rounded-md hover:bg-blue-600"
            >
                Reservar Cita
            </a>
        </section>
    );
}
