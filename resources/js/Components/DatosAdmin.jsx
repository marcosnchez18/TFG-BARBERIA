import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import Swal from 'sweetalert2';

export default function DatosAdmin({ admin }) {
    const [isEditing, setIsEditing] = useState({ nombre: false, email: false });
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(
        admin.imagen ? `/storage/${admin.imagen}` : '/images/default-avatar.png'
    );

    const { data, setData, patch, errors } = useForm({
        nombre: admin.nombre,
        email: admin.email,
    });

    const toggleEditing = (field) => {
        setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleUpdate = (field) => {
        patch(route('admin.actualizar-datos'), {
            preserveScroll: true,
            onSuccess: () => {
                Swal.fire('¡Actualizado!', `${field} ha sido actualizado correctamente.`, 'success');
                toggleEditing(field);
            },
            onError: (error) => {
                Swal.fire('Error', `Hubo un problema al actualizar ${field}: ${error[field] || 'Inténtalo de nuevo.'}`, 'error');
            },
        });
    };

    const handlePhotoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedPhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const savePhotoChange = () => {
        if (!selectedPhoto) {
            Swal.fire('Advertencia', 'No se ha seleccionado ninguna foto.', 'warning');
            return;
        }

        const formData = new FormData();
        formData.append('imagen', selectedPhoto);

        Inertia.post(route('admin.actualizar-foto', admin.id), formData, {
            onSuccess: () => {
                Swal.fire('¡Actualizado!', 'Foto actualizada con éxito.', 'success');
                setSelectedPhoto(null);
                setPhotoPreview(`/storage/${admin.imagen}`);
            },
            onError: () => {
                Swal.fire('Error', 'Hubo un problema al actualizar la foto. Inténtalo de nuevo.', 'error');
            },
        });
    };

    const cancelPhotoEdit = () => {
        setSelectedPhoto(null);
        setPhotoPreview(admin.imagen ? `/storage/${admin.imagen}` : '/images/default-avatar.png');
    };

    return (
        <div
            id="mis-datos-admin-container"
            className="bg-white p-10 rounded-lg shadow-lg max-w-4xl w-full border border-gray-200"
        >
            <div className="text-center mb-8">
                <label htmlFor="photo-input" className="cursor-pointer">
                    <img
                        src={photoPreview}
                        alt="Foto de perfil"
                        className="w-32 h-32 rounded-full mx-auto border-4 border-blue-500 shadow-md hover:opacity-80"
                    />
                </label>
                <input
                    id="photo-input"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                />
                {selectedPhoto && (
                    <div className="flex justify-center gap-4 mt-4">
                        <button
                            onClick={savePhotoChange}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            ✔️ Guardar
                        </button>
                        <button
                            onClick={cancelPhotoEdit}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            ✖️ Cancelar
                        </button>
                    </div>
                )}
                <h2 className="text-3xl font-bold mt-4 text-gray-800">Mis Datos</h2>
            </div>
            <form>
                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">Nombre:</label>
                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            value={data.nombre}
                            disabled={!isEditing.nombre}
                            onChange={(e) => setData('nombre', e.target.value)}
                            className={`border rounded-lg px-4 py-2 w-full ${
                                isEditing.nombre ? 'border-gray-400' : 'bg-gray-100 cursor-not-allowed'
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() =>
                                isEditing.nombre ? handleUpdate('nombre') : toggleEditing('nombre')
                            }
                            className={`px-4 py-2 rounded-lg text-white ${
                                isEditing.nombre ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                        >
                            {isEditing.nombre ? 'Guardar' : 'Editar'}
                        </button>
                    </div>
                    {errors.nombre && <p className="text-red-500 text-sm mt-2">{errors.nombre}</p>}
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">Email:</label>
                    <div className="flex items-center gap-4">
                        <input
                            type="email"
                            value={data.email}
                            disabled={!isEditing.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className={`border rounded-lg px-4 py-2 w-full ${
                                isEditing.email ? 'border-gray-400' : 'bg-gray-100 cursor-not-allowed'
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() =>
                                isEditing.email ? handleUpdate('email') : toggleEditing('email')
                            }
                            className={`px-4 py-2 rounded-lg text-white ${
                                isEditing.email ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                        >
                            {isEditing.email ? 'Guardar' : 'Editar'}
                        </button>
                    </div>
                    {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
                </div>

                <button
                    type="button"
                    onClick={() => Inertia.visit(route('password.request'))}
                    className="mt-6 w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Restablecer Contraseña
                </button>
            </form>
        </div>
    );
}
