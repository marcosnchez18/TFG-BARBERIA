import React from 'react';
import '../../css/Barber.css'; // Asegúrate de importar el archivo CSS

export default function Servicios() {
    return (
        <section id="services" className="py-12 bg-dark-brown text-center" style={{ fontFamily: 'Times New Roman, serif' }}>
            <div className="container mx-auto">
                <h2 className="text-3xl font-bold mb-4 text-white">Nuestros Servicios</h2>
                <br/><br/><br/><br/><br/>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-100 rounded-md shadow-md servicio-container">
                        <h3 className="text-xl font-semibold mb-2">Corte de Pelo</h3>
                        <h3 className="text-xl font-semibold mb-2 ocre-text">12€</h3>
                        <p>Cortes de alta calidad adaptados a tu estilo personal.</p>
                    </div>
                    <div className="p-4 bg-gray-100 rounded-md shadow-md servicio-container">
                        <h3 className="text-xl font-semibold mb-2">Afeitado Clásico</h3>
                        <h3 className="text-xl font-semibold mb-2 ocre-text">4€</h3>
                        <p>Afeitado tradicional con navaja para una experiencia relajante.</p>
                    </div>
                    <div className="p-4 bg-gray-100 rounded-md shadow-md servicio-container">
                        <h3 className="text-xl font-semibold mb-2">Arreglo de Barba</h3>
                        <h3 className="text-xl font-semibold mb-2 ocre-text">6€</h3>
                        <p>¿Fanático de la barba? Déjela en nuestras manos.</p>
                    </div>
                    <div className="p-4 bg-gray-100 rounded-md shadow-md servicio-container">
                        <h3 className="text-xl font-semibold mb-2">Corte + Barba</h3>
                        <h3 className="text-xl font-semibold mb-2 ocre-text">15€</h3>
                        <p>Todo un clásico, el corte siempre bien acompañado.</p>
                    </div>
                    <div className="p-4 bg-gray-100 rounded-md shadow-md servicio-container">
                        <h3 className="text-xl font-semibold mb-2">Depilado de cejas</h3>
                        <h3 className="text-xl font-semibold mb-2 ocre-text">4€</h3>
                        <p>Contamos con las últimas técnicas de depilado.</p>
                    </div>
                    <div className="p-4 bg-gray-100 rounded-md shadow-md servicio-container">
                        <h3 className="text-xl font-semibold mb-2">Champoo + Estilo</h3>
                        <h3 className="text-xl font-semibold mb-2 ocre-text">5€</h3>
                        <p>Pelo limpio y un buen peinado, confíe en nosotros.</p>
                    </div>
                    <div className="p-4 bg-gray-100 rounded-md shadow-md servicio-container">
                        <h3 className="text-xl font-semibold mb-2">Alisado de Keratina</h3>
                        <h3 className="text-xl font-semibold mb-2 ocre-text">50€</h3>
                        <p>El sol es el mayor enemigo del pelo, pero tenemos la solución.</p>
                    </div>
                    <div className="p-4 bg-gray-100 rounded-md shadow-md servicio-container">
                        <h3 className="text-xl font-semibold mb-2">Mechas</h3>
                        <h3 className="text-xl font-semibold mb-2 ocre-text">7€</h3>
                        <p>Si le gusta el color, ha acudido al sitio idóneo, contamos con los mejores tintes del mercado.</p>
                    </div>
                    <div className="p-4 bg-gray-100 rounded-md shadow-md servicio-container">
                        <h3 className="text-xl font-semibold mb-2">Corte + Barba + Cejas + Lavado</h3>
                        <h3 className="text-xl font-semibold mb-2 ocre-text">20€</h3>
                        <p>¿Necesita un buen completo?, aquí le dejamos una oferta irrechazable.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
