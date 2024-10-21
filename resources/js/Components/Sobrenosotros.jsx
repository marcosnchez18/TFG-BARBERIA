import React from 'react';

export default function SobreNosotros() {
    return (
        <section id="about" className="py-12 bg-gray-100 text-center">
            <div className="container mx-auto">
                <h2 className="text-3xl font-bold mb-4">Sobre Nosotros</h2>
                <p className="text-lg text-gray-700">
                    Somos una barbería con años de experiencia brindando el mejor servicio. Nuestro equipo está listo para hacer que te veas y te sientas increíble.
                </p>
                <p className="text-lg text-gray-700 mt-4">Horario de atención: Lunes a Sábado, 10:00 AM - 8:00 PM</p>
                <p className="text-lg text-gray-700 mt-4">Ubicación: Calle Ejemplo, Ciudad, País</p>
            </div>
        </section>
    );
}
