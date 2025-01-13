import React from 'react';
import '../../css/Barber.css'; 

export default function NuestraHistoria() {
    return (
        <section className="historia-barber-container py-12">
            <div className="contenedor-general mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

                {/* Bloque de texto - Peluquería del corazón */}
                <div className="info-peluqueria">
                    <h2 className="titulo-principal text-black-700">La peluquería del corazón de Sanlúcar</h2>
                    <p className="texto-descripcion mb-6">
                        Afincada en la Calle Ancha, y con más de 15 años de experiencia, viviendo cada día nuestra pasión como si fuese un trabajo.
                    </p>
                    <p className="texto-descripcion mb-6">
                        Con más de 50 mil clientes satisfechos. Un equipo joven y profesional de 2 personas. Decorado como la tradicional barbería italiana.
                    </p>
                    <p className="texto-descripcion">
                        En todos estos años tenemos el honor de ser la peluquería de confianza de mecánicos, médicos, fruteros, camareros, informáticos, profesores, autónomos, empresarios y un largo etcétera, hasta cantantes y jugadores de fútbol.
                    </p>
                </div>

                {/* Imagen relacionada - Barbería */}
                <div className="imagen-container">
                    <img
                        src="/images/hair.jpeg"
                        alt="Interior de la barbería"
                        className="img-normal"
                    />
                </div>

                {/* Imagen relacionada - Equipo */}
                <div className="imagen-container">
                    <img
                        src="/images/barberia.jpg"
                        alt="Equipo de barberos"
                        className="img-normal"
                    />
                </div>

                {/* Bloque de texto - Nuestra historia */}
                <div className="info-historia">
                    <h2 className="titulo-principal text-black-700">Nuestra historia</h2>
                    <p className="texto-descripcion mb-6">
                        Nuestra historia es fruto de un sueño hecho realidad, de mucha pasión y compromiso, de una fuerza creativa disruptiva que ha sabido expresarse con cortes, barbas y servicios que cada vez responden a las necesidades de los más jóvenes.
                    </p>
                    <p className="texto-descripcion">
                        Los pasos fueron muchos, siempre llenos de espíritu de sacrificio pero también de aventura y ganas de crecer.
                    </p>
                </div>
            </div>
        </section>
    );
}
