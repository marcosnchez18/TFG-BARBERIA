import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';
import NavigationAdmin from '../Components/NavigationAdmin';
import SobreNosotros from '@/Components/Sobrenosotros';
import Footer from '../Components/Footer';
import { Inertia } from '@inertiajs/inertia';

export default function Empleo({ ofertas }) {
    const { data, setData, post, put, reset, errors } = useForm({
        nombre: '',
        descripcion: '',
        duracion_meses: '',
        numero_vacantes: '',
        inscripciones_maximas: '',
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editingOfertaId, setEditingOfertaId] = useState(null);

    const validateFields = () => {
        if (!data.nombre.trim()) {
            Swal.fire('Error', 'El título de la oferta es obligatorio.', 'error');
            return false;
        }
        if (!data.descripcion.trim()) {
            Swal.fire('Error', 'La descripción es obligatoria.', 'error');
            return false;
        }
        if (!data.duracion_meses || data.duracion_meses <= 0) {
            Swal.fire('Error', 'La duración debe ser mayor a 0 meses.', 'error');
            return false;
        }
        if (!data.numero_vacantes || data.numero_vacantes <= 0) {
            Swal.fire('Error', 'Debe haber al menos una vacante.', 'error');
            return false;
        }
        if (!data.inscripciones_maximas || data.inscripciones_maximas <= 0) {
            Swal.fire('Error', 'El número máximo de inscripciones debe ser mayor a 0.', 'error');
            return false;
        }
        return true;
    };

    const resetEditing = () => {
        setIsEditing(false);
        setEditingOfertaId(null);
        reset(); // Limpia el formulario
    };

    // Llamar a resetEditing después de actualizar o cancelar


    const submit = (e) => {
        e.preventDefault();

        if (!validateFields()) return;

        if (isEditing) {
            put(route('ofertas.update', editingOfertaId), {
                onSuccess: () => {
                    reset();
                    setIsEditing(false);
                    Swal.fire('Actualizado', 'La oferta de empleo se actualizó con éxito.', 'success');
                },
            });
        } else {
            post(route('ofertas.store'), {
                onSuccess: () => {
                    reset();
                    Swal.fire('Publicada', 'La oferta de empleo se publicó con éxito.', 'success');
                },
            });
        }
    };

    const handleEdit = (oferta) => {
        setIsEditing(true);
        setEditingOfertaId(oferta.id);
        setData({
            nombre: oferta.nombre,
            descripcion: oferta.descripcion,
            duracion_meses: oferta.duracion_meses,
            numero_vacantes: oferta.numero_vacantes,
            inscripciones_maximas: oferta.inscripciones_maximas,
        });
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
                Inertia.delete(route('ofertas.destroy', id), {
                    onSuccess: () => {
                        Swal.fire('Eliminada', 'La oferta fue eliminada con éxito.', 'success');
                    },
                });
            }
        });
    };

    return (
        <div
            className="portal-empleo"
            style={{
                backgroundImage: `url('/images/barberia.jpg')`, // Fondo compartido
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '100vh',
            }}
        >
            <NavigationAdmin />
            <div className="portal-container mx-auto p-8 flex flex-row gap-8">
                {/* Columna izquierda: Formulario */}
                <div className="portal-formulario flex-1 bg-white bg-opacity-90 p-6 rounded-lg shadow-lg">
                    <h2 className="portal-subtitulo text-2xl font-bold mb-4">
                        {isEditing ? 'Editar oferta de empleo' : 'Crear nueva oferta de empleo'}
                    </h2>
                    <form onSubmit={submit} className="mt-4">
                        <div>
                            <label className="portal-label block text-lg">Título de la oferta</label>
                            <input
                                type="text"
                                value={data.nombre}
                                onChange={(e) => setData('nombre', e.target.value)}
                                className="portal-input w-full p-2 border rounded"
                            />
                            {errors.nombre && <span className="portal-error">{errors.nombre}</span>}
                        </div>
                        <div className="mt-4">
                            <label className="portal-label block text-lg">Descripción</label>
                            <textarea
                                value={data.descripcion}
                                onChange={(e) => setData('descripcion', e.target.value)}
                                className="portal-textarea w-full p-2 border rounded"
                            />
                            {errors.descripcion && <span className="portal-error">{errors.descripcion}</span>}
                        </div>
                        <div className="mt-4">
                            <label className="portal-label block text-lg">Duración (meses)</label>
                            <input
                                type="number"
                                value={data.duracion_meses}
                                onChange={(e) => setData('duracion_meses', e.target.value)}
                                className="portal-input w-full p-2 border rounded"
                            />
                            {errors.duracion_meses && (
                                <span className="portal-error">{errors.duracion_meses}</span>
                            )}
                        </div>
                        <div className="mt-4">
                            <label className="portal-label block text-lg">Número de vacantes</label>
                            <input
                                type="number"
                                value={data.numero_vacantes}
                                onChange={(e) => setData('numero_vacantes', e.target.value)}
                                className="portal-input w-full p-2 border rounded"
                            />
                            {errors.numero_vacantes && (
                                <span className="portal-error">{errors.numero_vacantes}</span>
                            )}
                        </div>
                        <div className="mt-4">
                            <label className="portal-label block text-lg">Máximo de inscripciones</label>
                            <input
                                type="number"
                                value={data.inscripciones_maximas}
                                onChange={(e) => setData('inscripciones_maximas', e.target.value)}
                                className="portal-input w-full p-2 border rounded"
                            />
                            {errors.inscripciones_maximas && (
                                <span className="portal-error">{errors.inscripciones_maximas}</span>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="portal-boton mt-4 text-white px-4 py-2 rounded bg-blue-500 hover:bg-blue-600"
                        >
                            {isEditing ? 'Actualizar Oferta' : 'Publicar Oferta'}
                        </button>
                        <button
    type="button"
    onClick={resetEditing}
    className="portal-boton-cancelar mt-4 text-white px-4 py-2 rounded bg-red-500 hover:bg-red-600"
>
    Cancelar
</button>

                    </form>

                </div>

                {/* Columna derecha: Ofertas publicadas */}
                <div className="portal-ofertas flex-1 bg-white bg-opacity-90 p-6 rounded-lg shadow-lg">
                    <h2 className="portal-subtitulo text-2xl font-bold mb-4">Ofertas de empleo publicadas</h2>
                    {ofertas && ofertas.length > 0 ? (
                        ofertas.map((oferta) => (
                            <div
                                key={oferta.id}
                                className="portal-oferta mt-4 p-4 border-b bg-white bg-opacity-90 shadow rounded"
                            >
                                <h3 className="portal-oferta-titulo text-xl font-semibold">{oferta.nombre}</h3>
                                <p className="portal-oferta-descripcion">{oferta.descripcion}</p>
                                <small className="portal-oferta-detalles">
                                    Duración: {oferta.duracion_meses} meses | Vacantes: {oferta.numero_vacantes} | Máximo
                                    Inscripciones: {oferta.inscripciones_maximas}
                                </small>
                                <div className="portal-oferta-acciones mt-2 flex justify-end gap-2">
                                    <button
                                        onClick={() => handleEdit(oferta)}
                                        className="portal-boton-editar"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={() => handleDelete(oferta.id)}
                                        className="portal-boton-eliminar"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="portal-sin-ofertas">No hay ofertas disponibles.</p>
                    )}
                </div>
            </div>
            <SobreNosotros />
            <Footer />
        </div>
    );
}
