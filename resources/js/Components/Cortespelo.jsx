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

    // Cambia de imagen automáticamente cada 3 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
        }, 3000); // 3000 ms = 3 segundos

        return () => clearInterval(interval); // Limpiar el intervalo cuando se desmonte el componente
    }, [images.length]);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    return (
        <section className="fin_home">
            <h2 className="text-3xl font-bold mb-4 text-black">Nuestros Clientes</h2>
            <br /><br /><br />
            <div className="carrusel-container">
                <button onClick={handlePrev} className="carrusel-button prev">❮</button>
                <div className="carrusel-slide">
                    <img
                        className="fotos_fades"
                        src={images[currentIndex]}
                        alt={`Imagen ${currentIndex + 1}`}
                    />
                </div>
                <button onClick={handleNext} className="carrusel-button next">❯</button>
            </div>

            <div>
                <p className="precios">Ven a visitarnos</p>
                <p className="reser">Reserva una cita</p>
                <p className="reser_desc">
                    Reserva una cita ahora con <br /> nosotros y disfruta un <br /> servicio a la altura de
                    <br /> nuestros clientes
                </p>
                <br/><br/><br/>

                <Link href="/register" className="boton_lugar">
                    Regístrate
                </Link>
            </div>
        </section>
    );
}
