import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';
import NavigationAdmin from '../../Components/NavigationAdmin';
import SobreNosotros from '@/Components/Sobrenosotros';
import Footer from '../../Components/Footer';
import { Inertia } from '@inertiajs/inertia';
import Publicaciones from '../../Components/Publicaciones';

export default function ForoAdmin({ noticias }) {
    const { data, setData, post, put, reset, errors } = useForm({
        titulo: '',
        contenido: '',
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editingNoticiaId, setEditingNoticiaId] = useState(null);

    const validateForm = () => {
        if (!data.titulo.trim()) {
            Swal.fire('Error', 'El título es obligatorio.', 'error');
            return false;
        }
        if (data.titulo.length < 5) {
            Swal.fire('Error', 'El título debe tener al menos 5 caracteres.', 'error');
            return false;
        }
        if (!data.contenido.trim()) {
            Swal.fire('Error', 'El contenido es obligatorio.', 'error');
            return false;
        }
        if (data.contenido.length < 10) {
            Swal.fire('Error', 'El contenido debe tener al menos 10 caracteres.', 'error');
            return false;
        }
        return true;
    };

    const submit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        if (isEditing) {
            put(route('noticias.update', editingNoticiaId), {
                onSuccess: () => {
                    reset();
                    setIsEditing(false);
                    Swal.fire('Actualizado', 'La noticia se actualizó con éxito.', 'success');
                },
                onError: () => {
                    Swal.fire('Error', 'Hubo un problema al actualizar la noticia.', 'error');
                },
            });
        } else {
            post(route('noticias.store'), {
                onSuccess: () => {
                    reset();
                    Swal.fire('Publicada', 'La noticia se publicó con éxito.', 'success');
                },
                onError: () => {
                    Swal.fire('Error', 'Hubo un problema al publicar la noticia.', 'error');
                },
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
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¡Esta acción no se puede deshacer!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                Inertia.delete(route('noticias.destroy', id), {
                    onSuccess: () => {
                        Swal.fire('Eliminada', 'La noticia fue eliminada con éxito.', 'success');
                    },
                    onError: () => {
                        Swal.fire('Error', 'Hubo un problema al eliminar la noticia.', 'error');
                    },
                });
            }
        });
    };

    return (
        <div
            className="foro-barberia"
            style={{
                backgroundImage: `url('/images/barberia.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '100vh',
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

                {/* Columna derecha: Publicaciones */}
                <Publicaciones noticias={noticias} onEdit={handleEdit} onDelete={handleDelete} />
            </div>
            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
            <SobreNosotros />
            <Footer />
        </div>
    );
}
