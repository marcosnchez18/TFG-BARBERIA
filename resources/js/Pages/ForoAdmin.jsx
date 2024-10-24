import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import NavigationAdmin from '../Components/NavigationAdmin';
import SobreNosotros from '@/Components/Sobrenosotros';
import Footer from '../Components/Footer';
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
        <div
            className="foro-barberia"
            style={{
                backgroundImage: `url('/images/barberia.jpg')`, // Aquí especifica la ruta de tu imagen
                backgroundSize: 'cover', // Que la imagen cubra toda la pantalla
                backgroundPosition: 'center', // Centrar la imagen
                backgroundRepeat: 'no-repeat', // No repetir la imagen
                minHeight: '100vh', // Asegurarse de que cubra toda la altura de la pantalla
            }}
        >
            <NavigationAdmin />
            <br /><br /><br /><br /><br />
            <div className="foro-container mx-auto p-8 flex flex-row gap-8">
                {/* Columna izquierda: Formulario */}
                <div className="foro-formulario flex-1 bg-white p-6 rounded-lg shadow-lg">
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
                            {errors.titulo && <span className="foro-error">{errors.titulo}</span>}
                        </div>
                        <div className="mt-4">
                            <label className="foro-label block text-lg">Contenido</label>
                            <textarea
                                value={data.contenido}
                                onChange={(e) => setData('contenido', e.target.value)}
                                className="foro-textarea w-full p-2 border rounded"
                            />
                            {errors.contenido && <span className="foro-error">{errors.contenido}</span>}
                        </div>
                        <button type="submit" className="foro-boton mt-4 text-white px-4 py-2 rounded bg-blue-500">
                            {isEditing ? 'Actualizar Noticia' : 'Publicar Noticia'}
                        </button>
                    </form>
                </div>

                {/* Columna derecha: Noticias */}
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
                                        onClick={() => handleEdit(noticia)}
                                        className="foro-boton-editar "
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={() => handleDelete(noticia.id)}
                                        className="foro-boton-eliminar "
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
            </div>
            <br /><br /><br /><br />
            <SobreNosotros />
            <Footer />
        </div>
    );
}
