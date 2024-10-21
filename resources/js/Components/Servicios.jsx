import React from 'react';

export default function Servicios() {
    return (
        <section id="services" className="py-12 bg-white text-center">
            <div className="container mx-auto">
                <h2 className="text-3xl font-bold mb-4">Nuestros Servicios</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-100 rounded-md shadow-md">
                        <h3 className="text-xl font-semibold mb-2">Corte de Pelo</h3>
                        <p>Cortes de alta calidad adaptados a tu estilo personal.</p>
                    </div>
                    <div className="p-4 bg-gray-100 rounded-md shadow-md">
                        <h3 className="text-xl font-semibold mb-2">Afeitado Clásico</h3>
                        <p>Afeitado tradicional con navaja para una experiencia relajante.</p>
                    </div>
                    <div className="p-4 bg-gray-100 rounded-md shadow-md">
                        <h3 className="text-xl font-semibold mb-2">Arreglo de Barba</h3>
                        <p>Cuida tu barba con un estilo definido y profesional.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
