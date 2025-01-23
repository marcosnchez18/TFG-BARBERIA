import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/es';

dayjs.extend(relativeTime);
dayjs.locale('es');

export default function Noticias({ noticias }) {
    return (
        <div className="epic-noticias-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
            {noticias && noticias.length > 0 ? (
                noticias.map((noticia) => (
                    <div
                        key={noticia.id}
                        className="epic-noticia-card bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600 text-white rounded-xl shadow-xl p-8 transform transition duration-500 hover:scale-105 hover:shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-900 opacity-60 rounded-xl"></div>

                        {/* Decoración con formas */}
                        <div className="absolute -top-6 -right-6 w-20 h-20 bg-yellow-600 rounded-full opacity-20 transform animate-pulse"></div>
                        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-orange-500 rounded-full opacity-20 transform animate-pulse"></div>

                        {/* Contenido de la noticia */}
                        <div className="relative z-10">
                            <h3 className="epic-noticia-title text-3xl font-extrabold mb-4 text-center tracking-widest">
                                {noticia.titulo}
                            </h3>
                            <p className="epic-noticia-content text-lg leading-relaxed text-justify mb-4">
                                {noticia.contenido}
                            </p>
                        </div>

                        {/* Autor y tiempo de publicación */}
                        <div className="epic-noticia-footer flex justify-between items-center text-sm opacity-80 mt-6 relative z-10 border-t border-gray-500 pt-4">
                            <span className="epic-noticia-author">
                                Publicado por: <span className="font-bold">{noticia.usuario.nombre}</span>
                            </span>
                            <span className="text-xs italic text-gray-300">
                                {dayjs(noticia.created_at).fromNow()}
                            </span>
                        </div>
                    </div>
                ))
            ) : (
                <p className="epic-noticia-empty text-center text-gray-400 text-2xl col-span-full font-light italic">
                    No hay noticias disponibles en este momento.
                </p>
            )}
        </div>
    );
}
