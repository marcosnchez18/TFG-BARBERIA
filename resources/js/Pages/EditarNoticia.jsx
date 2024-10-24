import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import NavigationAdmin from '../Components/NavigationAdmin';

export default function EditarNoticia({ noticia }) {
    const { data, setData, put, errors } = useForm({
        titulo: noticia.titulo || '',
        contenido: noticia.contenido || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('noticias.update', noticia.id));
    };

    return (
        <div>
            <NavigationAdmin />
            <div className="container mx-auto p-8">
                <h1 className="text-4xl font-bold">Editar Noticia</h1>

                <form onSubmit={handleSubmit} className="mt-8">
                    <div>
                        <label className="block text-sm font-bold">Título</label>
                        <input
                            type="text"
                            value={data.titulo}
                            onChange={(e) => setData('titulo', e.target.value)}
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
                        />
                        {errors.titulo && <div className="text-red-500">{errors.titulo}</div>}
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-bold">Contenido</label>
                        <textarea
                            value={data.contenido}
                            onChange={(e) => setData('contenido', e.target.value)}
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
                        />
                        {errors.contenido && <div className="text-red-500">{errors.contenido}</div>}
                    </div>

                    <button
                        type="submit"
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                        Actualizar Noticia
                    </button>
                </form>
            </div>
        </div>
    );
}
