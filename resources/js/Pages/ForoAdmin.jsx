import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import NavigationAdmin from '../Components/NavigationAdmin';
import { Inertia } from '@inertiajs/inertia';

export default function ForoAdmin({ noticias }) {
    const { data, setData, post, put, reset, errors } = useForm({
        titulo: '',
        contenido: '',
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editingNoticiaId, setEditingNoticiaId] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route('noticias.update', editingNoticiaId), {
                onSuccess: () => {
                    reset();
                    setIsEditing(false);
                },
            });
        } else {
            post(route('noticias.store'), {
                onSuccess: () => reset(),
            });
        }
    };

    const handleEdit = (noticia) => {
        setIsEditing(true);
        setEditingNoticiaId(noticia.id);
        setData('titulo', noticia.titulo);
        setData('contenido', noticia.contenido);
    };

    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de que deseas eliminar esta noticia?')) {
            Inertia.delete(route('noticias.destroy', id), {
                onSuccess: () => {
                    alert('Noticia eliminada con éxito');
                },
            });
        }
    };

    return (
        <div className="foro-barberia">
            <NavigationAdmin />
            <div className="foro-container mx-auto p-8 flex flex-row gap-8">
                {/* Columna izquierda: Formulario */}
                <div className="foro-formulario flex-1">
                    <h2 className="foro-subtitulo text-2xl font-bold mb-4">
                        {isEditing ? 'Editar noticia' : 'Crear nueva noticia'}
                    </h2>
                    <form onSubmit={submit} className="mt-4">
                        <div>
                            <label className="foro-label block text-lg">Título</label>
                            <input
                                type="text"
                                value={data.titulo}
                                onChange={(e) => setData('titulo', e.target.value)}
                                className="foro-input w-full p-2 border rounded"
                            />
                            {errors.titulo && <span className="foro-error text-red-600">{errors.titulo}</span>}
                        </div>
                        <div className="mt-4">
                            <label className="foro-label block text-lg">Contenido</label>
                            <textarea
                                value={data.contenido}
                                onChange={(e) => setData('contenido', e.target.value)}
                                className="foro-textarea w-full p-2 border rounded"
                            />
                            {errors.contenido && <span className="foro-error text-red-600">{errors.contenido}</span>}
                        </div>
                        <button type="submit" className="foro-boton mt-4 text-white px-4 py-2 rounded">
                            {isEditing ? 'Actualizar Noticia' : 'Publicar Noticia'}
                        </button>
                    </form>
                </div>

                {/* Columna derecha: Noticias */}
                <div className="foro-noticias flex-1">
                    <h2 className="foro-subtitulo text-2xl font-bold mb-4">Noticias Publicadas</h2>
                    {noticias && noticias.length > 0 ? (
                        noticias.map((noticia) => (
                            <div key={noticia.id} className="foro-noticia mt-4 p-4 border-b">
                                <h3 className="foro-noticia-titulo text-xl font-semibold">{noticia.titulo}</h3>
                                <p className="foro-noticia-contenido">{noticia.contenido}</p>
                                <small className="foro-noticia-autor">Publicado por: {noticia.usuario.nombre}</small>
                                <div className="foro-noticia-acciones mt-2">
                                    <button
                                        onClick={() => handleEdit(noticia)}
                                        className="foro-boton-editar text-blue-500 hover:underline"
                                    >
                                        Editar
                                    </button>
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            handleDelete(noticia.id);
                                        }}
                                    >
                                        <button
                                            type="submit"
                                            className="foro-boton-eliminar text-red-500 hover:underline ml-4"
                                        >
                                            Eliminar
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="foro-sin-noticias">No hay noticias disponibles.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
