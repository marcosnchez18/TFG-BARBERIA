import React from 'react';
import '../../css/Barber.css'; // Asegúrate de importar el archivo CSS

export default function Infobarber() {
    return (
        <section className="infobarber-container py-12">
            <div className="x-layout mx-auto">
                {/* Esquina superior izquierda - Texto */}
                <div className="text-block bg-white shadow-lg p-6" style={{ marginRight: '2rem' }}>
                    <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Times New Roman, serif', fontSize: '2.5rem' }}>
                        Profesionales llenos de pasión
                    </h2>
                    <p className="text-lg mb-4" style={{ fontFamily: 'Times New Roman, serif', fontSize: '1.5rem' }}>
                        Barber’s 18 cuenta con los mejores profesionales del cuidado del cabello del hombre. Artistas llenos de pasión y con muchos años de experiencia en el sector, constantemente actualizados en nuevas metodologías.
                    </p>
                </div>

                {/* Esquina superior derecha - Imágenes estilo cubo */}
                <div className="image-block" style={{ marginLeft: '10rem' }}>
                    <div className="image-cube">
                        <img
                            src="/images/barberia.jpg"
                            alt="Barbero José"
                            className="main-image"
                        />
                    </div>
                </div>

                {/* Esquina inferior izquierda - Imágenes estilo cubo */}
                <div className="image-block" style={{ marginRight: '10rem' }}>
                    <div className="image-cube">
                        <img
                            src="/images/responsive.jpg"
                            alt="Barbero Héctor"
                            className="main-image"
                        />
                    </div>
                </div>

                {/* Esquina inferior derecha - Texto */}
                <div className="text-block bg-white rounded-lg shadow-lg p-6" style={{ marginLeft: '2rem' }}>
                    <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Times New Roman, serif', fontSize: '2.5rem' }}>
                        Lo que ofrecemos
                    </h2>
                    <p className="text-lg mb-4" style={{ fontFamily: 'Times New Roman, serif', fontSize: '1.5rem' }}>
                        Mucho más que una simple peluquería, que además de ofrecer servicios básicos, cuida cada detalle para ofrecer solo lo mejor a hombres y niños.
                    </p>
                </div>
            </div>
        </section>
    );
}
