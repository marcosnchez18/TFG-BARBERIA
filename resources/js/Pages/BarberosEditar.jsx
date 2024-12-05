import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import Swal from 'sweetalert2';
import NavigationAdmin from '../Components/NavigationAdmin';
import SobreNosotros from '@/Components/Sobrenosotros';
import Footer from '../Components/Footer';
import { Link } from '@inertiajs/react';

export default function TrabajadoresAdmin({ trabajadores }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [editableId, setEditableId] = useState(null);
    const [editableField, setEditableField] = useState(null);
    const [editableValue, setEditableValue] = useState('');
    const [editingPhotoId, setEditingPhotoId] = useState(null);
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const eliminarTrabajador = (id) => {
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
                Inertia.delete(route('trabajadores.destroy', id), {
                    onSuccess: () => {
                        Swal.fire('Eliminado', 'Trabajador eliminado con éxito.', 'success');
                    },
                });
            }
        });
    };



    const cambiarEstado = (id, estadoActual) => {
        const accion = estadoActual === 'activo' ? 'deshabilitar' : 'habilitar';
        const titulo = estadoActual === 'activo' ? '¿Deseas deshabilitar este trabajador?' : '¿Deseas habilitar este trabajador?';

        Swal.fire({
            title: titulo,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: `Sí, ${accion}`,
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                Inertia.patch(route(`trabajadores.${accion}`, id), {
                    onSuccess: () => {
                        Swal.fire(
                            accion === 'deshabilitar' ? 'Deshabilitado' : 'Habilitado',
                            `Trabajador ${accion} con éxito.`,
                            'success'
                        );
                    },
                });
            }
        });
    };

    const validarCampos = () => {
        if (editableValue.trim() === '') {
            Swal.fire('Error', 'Este campo no puede estar vacío.', 'error');
            return false;
        }
        if (editableField === 'email' && !/\S+@\S+\.\S+/.test(editableValue)) {
            Swal.fire('Error', 'Por favor ingresa un correo válido.', 'error');
            return false;
        }
        return true;
    };

    const saveFieldChange = (id) => {
        if (validarCampos()) {
            const data = { [editableField]: editableValue };
            Inertia.patch(route('trabajadores.updateField', id), data, {
                onSuccess: () => {
                    Swal.fire('Actualizado', `${editableField} actualizado con éxito.`, 'success');
                    setEditableId(null);
                    setEditableField(null);
                    setEditableValue('');
                },
            });
        }
    };


    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size > 5000000) { // 5MB máximo
            Swal.fire('Error', 'El tamaño del archivo es demasiado grande. Máximo 5MB.', 'error');
            return;
        }
        setSelectedPhoto(file);
    };


    const savePhotoChange = (id) => {
        const formData = new FormData();
        formData.append('imagen', selectedPhoto);

        Inertia.post(route('trabajadores.updatePhoto', id), formData, {
            onSuccess: () => {
                Swal.fire('Actualizado', 'Foto actualizada con éxito.', 'success');
                setEditingPhotoId(null);
                setSelectedPhoto(null);
            },
        });
    };

    const cancelPhotoEdit = () => {
        setEditingPhotoId(null);
        setSelectedPhoto(null);
    };

    const filteredTrabajadores = trabajadores.filter((trabajador) =>
        trabajador.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trabajador.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div
            style={{
                backgroundImage: `url('/images/barberia.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
            }}
        >
            <NavigationAdmin />
            <br /><br />
            <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-7xl mx-auto  mt-20 relative">

            <div className="absolute top-2 right-2">
                    <Link href="/opciones" className="text-black-600 text-xl font-bold hover:text-gray-400">✕</Link>
                </div>
                <h2 className="text-4xl text-center font-bold text-gray-800 mb-6">Gestión de Trabajadores</h2>

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Buscar por nombre o correo electrónico..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <table className="table-auto w-full border-collapse border border-gray-300 rounded-lg">
                        <thead>
                            <tr className="bg-[#464242] text-white">
                                <th className="border border-gray-300 px-4 py-2">Foto</th>
                                <th className="border border-gray-300 px-4 py-2">Nombre</th>
                                <th className="border border-gray-300 px-4 py-2">Correo</th>
                                <th className="border border-gray-300 px-4 py-2 text-center">Estado</th>
                                <th className="border border-gray-300 px-4 py-2 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTrabajadores.map((trabajador) => (
                                <tr key={trabajador.id} className="hover:bg-gray-100">
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        {editingPhotoId === trabajador.id ? (
                                            <div className="flex items-center justify-center">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handlePhotoChange}
                                                    className="mb-2"
                                                />
                                                <button
                                                    onClick={() => savePhotoChange(trabajador.id)}
                                                    className="ml-2 bg-green-500 text-white px-2 py-1 rounded"
                                                >
                                                    ✔️
                                                </button>
                                                <button
                                                    onClick={cancelPhotoEdit}
                                                    className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
                                                >
                                                    ✖️
                                                </button>
                                            </div>
                                        ) : (
                                            <img
                                                src={trabajador.imagen ? `/storage/${trabajador.imagen}` : '/images/default-avatar.png'}
                                                alt={trabajador.nombre}
                                                className="rounded-full w-16 h-16 mx-auto cursor-pointer"
                                                onClick={() => setEditingPhotoId(trabajador.id)}
                                            />
                                        )}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {editableId === trabajador.id && editableField === 'nombre' ? (
                                            <div className="flex items-center">
                                                <input
                                                    type="text"
                                                    value={editableValue}
                                                    onChange={(e) => setEditableValue(e.target.value)}
                                                    className="border rounded p-1"
                                                />
                                                <button
                                                    onClick={() => saveFieldChange(trabajador.id)}
                                                    className="ml-2 bg-green-500 text-white px-2 py-1 rounded"
                                                >
                                                    ✔️
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditableId(null);
                                                        setEditableField(null);
                                                        setEditableValue('');
                                                    }}
                                                    className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
                                                >
                                                    ✖️
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                {trabajador.nombre}
                                                <button
                                                    onClick={() => {
                                                        setEditableId(trabajador.id);
                                                        setEditableField('nombre');
                                                        setEditableValue(trabajador.nombre);
                                                    }}
                                                    className="ml-2 text-blue-500 hover:text-blue-700"
                                                >
                                                    ✏️
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {editableId === trabajador.id && editableField === 'email' ? (
                                            <div className="flex items-center">
                                                <input
                                                    type="email"
                                                    value={editableValue}
                                                    onChange={(e) => setEditableValue(e.target.value)}
                                                    className="border rounded p-1"
                                                />
                                                <button
                                                    onClick={() => saveFieldChange(trabajador.id)}
                                                    className="ml-2 bg-green-500 text-white px-2 py-1 rounded"
                                                >
                                                    ✔️
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditableId(null);
                                                        setEditableField(null);
                                                        setEditableValue('');
                                                    }}
                                                    className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
                                                >
                                                    ✖️
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                {trabajador.email}
                                                <button
                                                    onClick={() => {
                                                        setEditableId(trabajador.id);
                                                        setEditableField('email');
                                                        setEditableValue(trabajador.email);
                                                    }}
                                                    className="ml-2 text-blue-500 hover:text-blue-700"
                                                >
                                                    ✏️
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        <span
                                            className={`inline-block px-2 py-1 rounded ${
                                                trabajador.estado === 'activo' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                            }`}
                                        >
                                            {trabajador.estado === 'activo' ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center space-x-2">
                                        <button
                                            onClick={() => eliminarTrabajador(trabajador.id)}
                                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 inline-flex items-center"
                                        >
                                            🗑️ <span className="ml-1"></span>
                                        </button>
                                        <button
                                            onClick={() => cambiarEstado(trabajador.id, trabajador.estado)}
                                            className={`inline-flex items-center px-2 py-1 rounded ${
                                                trabajador.estado === 'activo' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'
                                            } text-white`}
                                        >
                                            {trabajador.estado === 'activo' ? '🚫' : '✔️'} <span className="ml-1">{trabajador.estado === 'activo' ? 'Deshabilitar' : 'Habilitar'}</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
            <SobreNosotros />
            <Footer />
        </div>
    );
}
