import React from 'react';

export default function Publicaciones({ noticias, onEdit, onDelete }) {
    return (
        <div className="foro-noticias flex-1">
            <h2 className="foro-subtitulo text-2xl font-bold mb-4">Noticias Publicadas</h2>
            {noticias && noticias.length > 0 ? (
                noticias.map((noticia) => (
                    <div key={noticia.id} className="foro-noticia mt-4 p-4 border-b bg-white shadow rounded">
                        <h3 className="foro-noticia-titulo text-xl font-semibold">{noticia.titulo}</h3>
                        <p className="foro-noticia-contenido">{noticia.contenido}</p>
                        <small className="foro-noticia-autor">Publicado por: {noticia.usuario.nombre}</small>
                        <div className="foro-noticia-acciones mt-2 flex justify-end gap-2">
                            <button
                                onClick={() => onEdit(noticia)}
                                className="foro-boton-editar"
                            >
                                ✏️
                            </button>
                            <button
                                onClick={() => onDelete(noticia.id)}
                                className="foro-boton-eliminar"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p className="foro-sin-noticias">No hay noticias disponibles.</p>
            )}
        </div>
    );
}
