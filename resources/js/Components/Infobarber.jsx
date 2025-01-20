import React from 'react';
import '../../css/Barber.css';

export default function Infobarber() {
  return (
    <section className="infobarber-container py-12">
      {/*
        Con contenedor grid:
         - Por defecto (pantallas pequeñas), "grid-cols-1": 1 columna => todos en una misma columna (uno debajo de otro).
         - A partir del breakpoint md (>= 768px por defecto en Tailwind): "md:grid-cols-2" y "md:grid-rows-2" => 2 columnas / 2 filas.
      */}
      <div className="x-layout mx-auto px-4 grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-8">

        {/* Bloque 1: Texto superior izquierdo */}
        <div className="bg-white shadow-lg p-6">
          <h2
            className="text-2xl font-bold mb-4"
            style={{ fontFamily: 'Times New Roman, serif', fontSize: '2.5rem' }}
          >
            Profesionales llenos de pasión
          </h2>
          <p
            className="text-lg mb-4"
            style={{ fontFamily: 'Times New Roman, serif', fontSize: '1.5rem' }}
          >
            Barber’s 18 cuenta con los mejores profesionales del cuidado del cabello del hombre.
            Artistas llenos de pasión y con muchos años de experiencia en el sector, constantemente
            actualizados en nuevas metodologías.
          </p>
        </div>

        {/* Bloque 2: Imagen superior derecha */}
        <div className="flex justify-center items-center">
          {/*
            Ajustamos la imagen para que se vea bien de forma responsiva:
             - w-full: ocupa todo el ancho de su contenedor
             - h-auto: altura automática para mantener la proporción
             - rounded y shadow-lg son opcionales para estética
          */}
          <img
            src="/images/barberia.jpg"
            alt="Barbero José"
            className="w-full h-auto rounded shadow-lg"
          />
        </div>

        {/* Bloque 3: Imagen inferior izquierda */}
        <div className="flex justify-center items-center">
          <img
            src="/images/responsive.jpg"
            alt="Barbero Héctor"
            className="w-full h-auto rounded shadow-lg"
          />
        </div>

        {/* Bloque 4: Texto inferior derecho */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2
            className="text-2xl font-bold mb-4"
            style={{ fontFamily: 'Times New Roman, serif', fontSize: '2.5rem' }}
          >
            Lo que ofrecemos
          </h2>
          <p
            className="text-lg mb-4"
            style={{ fontFamily: 'Times New Roman, serif', fontSize: '1.5rem' }}
          >
            Mucho más que una simple peluquería, que además de ofrecer servicios básicos,
            cuida cada detalle para ofrecer solo lo mejor a hombres y niños.
          </p>
        </div>

      </div>
    </section>
  );
}
