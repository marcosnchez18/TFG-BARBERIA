import React from 'react';
import '../../css/Barber.css'; 

export default function TrianguloInvertido() {
    return (
        <section className="seccion2_triangulo">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                {/* Ajustamos el triángulo para que termine en un pico más pronunciado */}
                <polygon points="0,100 50,85 100,100" className="triangulo_invertido" />
            </svg>
        </section>
    );
}
