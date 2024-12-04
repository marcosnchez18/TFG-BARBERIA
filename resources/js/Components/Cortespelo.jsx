import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import '../../css/Barber.css';

export default function FinHome() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const images = [
        "/images/fade1.png",
        "/images/fade2.png",
        "/images/fade3.jpg",
        "/images/fade4.png",
        "/images/fade5.png"
    ];

    // Cambiar automáticamente cada 3 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
        }, 3000);

        return () => clearInterval(interval); // Limpiar intervalo
    }, [images.length]);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    return (
        <section className="fin_home flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h2 className="text-3xl font-bold mb-4 text-black text-center">Nuestros Clientes</h2>
            <br /><br />
            <div className="carrusel-container relative flex items-center justify-center">
                <div className="carrusel-slide relative">

                    <img
                        className="fotos_fades w-full rounded-lg shadow-lg"
                        src={images[currentIndex]}
                        alt={`Imagen ${currentIndex + 1}`}
                    />

                </div>
            </div>

            {/* Indicadores */}
            <div className="flex justify-center mt-4 space-x-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full ${
                            currentIndex === index ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                    ></button>
                ))}
            </div>

            <div className="text-center mt-8">
                <p className="precios text-lg">Ven a visitarnos</p>
                <p className="reser text-2xl font-semibold mt-2">Reserva una cita</p>
                <p className="reser_desc mt-4 text-gray-600">
                    Reserva una cita ahora con <br /> nosotros y disfruta un <br /> servicio a la altura de
                    <br /> nuestros clientes
                </p>
                <Link
                    href="/register"
                    className="boton_lugar mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                    Regístrate
                </Link>
            </div>
        </section>
    );
}
