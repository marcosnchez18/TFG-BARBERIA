import React from 'react';
import NavigationCliente from '../Components/NavigationCliente';

export default function ReservarCitaCliente({ noticias }) {
    return (
        <div>
            <NavigationCliente />
            <div className="container mx-auto p-8">
                <h1 className="text-4xl font-bold">Reservar Cita</h1>

                {/* Mostrar noticias disponibles */}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold">Últimas Noticias</h2>
                    {noticias && noticias.length > 0 ? (
                        noticias.map((noticia) => (
                            <div key={noticia.id} className="mt-4 p-4 border-b">
                                <h3 className="text-xl font-semibold">{noticia.titulo}</h3>
                                <p>{noticia.contenido}</p>
                                <small>Publicado por: {noticia.usuario.nombre}</small>
                            </div>
                        ))
                    ) : (
                        <p>No hay noticias disponibles en este momento.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
