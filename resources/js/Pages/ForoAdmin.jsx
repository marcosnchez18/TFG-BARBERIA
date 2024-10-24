import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import NavigationAdmin from '../Components/NavigationAdmin';

export default function ForoAdmin({ noticias }) {
    const { data, setData, post, reset, errors } = useForm({
        titulo: '',
        contenido: ''
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('noticias.store'), {
            onSuccess: () => reset() // Limpiar el formulario después de enviar
        });
    };

    return (
        <div>
            <NavigationAdmin />
            <div className="container mx-auto p-8">
                <h1 className="text-4xl font-bold">Foro del Administrador</h1>

                {/* Formulario para crear una nueva noticia */}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold">Crear nueva noticia</h2>
                    <form onSubmit={submit} className="mt-4">
                        <div>
                            <label className="block text-lg">Título</label>
                            <input
                                type="text"
                                value={data.titulo}
                                onChange={(e) => setData('titulo', e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                            {errors.titulo && <span className="text-red-600">{errors.titulo}</span>}
                        </div>
                        <div className="mt-4">
                            <label className="block text-lg">Contenido</label>
                            <textarea
                                value={data.contenido}
                                onChange={(e) => setData('contenido', e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                            {errors.contenido && <span className="text-red-600">{errors.contenido}</span>}
                        </div>
                        <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                            Publicar Noticia
                        </button>
                    </form>
                </div>

                {/* Listado de noticias existentes */}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold">Noticias Publicadas</h2>
                    {noticias && noticias.length > 0 ? (
                        noticias.map((noticia) => (
                            <div key={noticia.id} className="mt-4 p-4 border-b">
                                <h3 className="text-xl font-semibold">{noticia.titulo}</h3>
                                <p>{noticia.contenido}</p>
                                <small>Publicado por: {noticia.usuario.nombre}</small>
                            </div>
                        ))
                    ) : (
                        <p>No hay noticias disponibles.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
