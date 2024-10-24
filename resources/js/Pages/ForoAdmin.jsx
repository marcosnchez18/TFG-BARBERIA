import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import NavigationAdmin from '../Components/NavigationAdmin';
import { Inertia } from '@inertiajs/inertia';

export default function ForoAdmin({ noticias }) {
    const { data, setData, post, put, reset, errors } = useForm({
        titulo: '',
        contenido: '',
    });

    const [isEditing, setIsEditing] = useState(false); // Para controlar si estamos editando una noticia
    const [editingNoticiaId, setEditingNoticiaId] = useState(null); // ID de la noticia en edición

    // Manejar envío de formulario para crear o actualizar noticia
    const submit = (e) => {
        e.preventDefault();
        if (isEditing) {
            // Actualizar noticia existente
            put(route('noticias.update', editingNoticiaId), {
                onSuccess: () => {
                    reset();
                    setIsEditing(false);
                },
            });
        } else {
            // Crear nueva noticia
            post(route('noticias.store'), {
                onSuccess: () => reset(), // Limpiar el formulario después de enviar
            });
        }
    };

    // Manejar la edición de una noticia
    const handleEdit = (noticia) => {
        setIsEditing(true);
        setEditingNoticiaId(noticia.id);
        setData('titulo', noticia.titulo);
        setData('contenido', noticia.contenido);
    };

    // Manejar la eliminación de una noticia
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
        <div>
            <NavigationAdmin />
            <div className="container mx-auto p-8">
                <h1 className="text-4xl font-bold">Foro del Administrador</h1>

                {/* Formulario para crear o editar una noticia */}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold">
                        {isEditing ? 'Editar noticia' : 'Crear nueva noticia'}
                    </h2>
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
                            {isEditing ? 'Actualizar Noticia' : 'Publicar Noticia'}
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
                                <div className="mt-2">
                                    {/* Botón para editar noticia */}
                                    <button
                                        onClick={() => handleEdit(noticia)}
                                        className="text-blue-500 hover:underline"
                                    >
                                        Editar
                                    </button>

                                    {/* Formulario para eliminar noticia */}
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            if (confirm('¿Estás seguro de que deseas eliminar esta noticia?')) {
                                                Inertia.delete(route('noticias.destroy', noticia.id));
                                            }
                                        }}
                                    >
                                        <button
                                            type="submit"
                                            className="text-red-500 hover:underline ml-4"
                                        >
                                            Eliminar
                                        </button>
                                    </form>
                                </div>
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
