import React, { useState } from 'react';
import { usePage, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';
import NavigationCliente from '../Components/NavigationCliente';

export default function MisDatosCliente() {
    const { cliente } = usePage().props;
    const { data, setData, patch, processing, errors } = useForm({
        nombre: cliente.nombre,
        email: cliente.email,
    });

    const [isEditing, setIsEditing] = useState({
        nombre: false,
        email: false,
    });

    const validateFields = (field) => {
        let error = null;

        if (field === 'nombre') {
            if (!data.nombre.trim()) {
                error = 'El nombre no puede estar vacío.';
            } else if (data.nombre === cliente.nombre) {
                error = 'Por favor, introduce un nombre distinto al actual.';
            }
        }

        if (field === 'email') {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!data.email.trim()) {
                error = 'El email no puede estar vacío.';
            } else if (!emailPattern.test(data.email)) {
                error = 'Por favor, introduce un email válido.';
            } else if (data.email === cliente.email) {
                error = 'Por favor, introduce un email distinto al actual.';
            }
        }

        return error;
    };

    const handleSubmit = (field) => {
        const errorMessage = validateFields(field);

        if (errorMessage) {
            Swal.fire('Error', errorMessage, 'error');
            return;
        }

        patch(route('cliente.update'), {
            preserveScroll: true,
            onSuccess: () => {
                if (field === 'email') {
                    Swal.fire({
                        title: 'Revisa tu correo',
                        text: 'Se ha enviado un enlace de verificación a tu nuevo email.',
                        icon: 'info',
                    });
                } else {
                    Swal.fire('Actualizado', `${field} actualizado correctamente`, 'success');
                }
                setIsEditing({ ...isEditing, [field]: false });
            },
            onError: () => {
                Swal.fire('Error', `No se pudo actualizar el campo ${field}`, 'error');
            },
        });
    };

    return (
        <div>
            <NavigationCliente />
            <div className="container mx-auto p-8 bg-white rounded-lg shadow-md">
                <h1 className="text-4xl font-bold mb-6">Mis Datos</h1>
                <form>
                    {/* Campo de Nombre */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Nombre:</label>
                        <div className="flex items-center">
                            <input
                                type="text"
                                value={data.nombre}
                                disabled={!isEditing.nombre}
                                onChange={(e) => setData('nombre', e.target.value)}
                                className="border p-2 rounded w-full"
                            />
                            <button
                                type="button"
                                onClick={() => isEditing.nombre ? handleSubmit('nombre') : setIsEditing({ ...isEditing, nombre: true })}
                                className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                {isEditing.nombre ? 'Guardar' : 'Editar'}
                            </button>
                        </div>
                        {errors.nombre && <div className="text-red-500">{errors.nombre}</div>}
                    </div>

                    {/* Campo de Email */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Email:</label>
                        <div className="flex items-center">
                            <input
                                type="email"
                                value={data.email}
                                disabled={!isEditing.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="border p-2 rounded w-full"
                            />
                            <button
                                type="button"
                                onClick={() => isEditing.email ? handleSubmit('email') : setIsEditing({ ...isEditing, email: true })}
                                className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                {isEditing.email ? 'Guardar' : 'Editar'}
                            </button>
                        </div>
                        {errors.email && <div className="text-red-500">{errors.email}</div>}
                    </div>

                    {/* Campo de Saldo (no editable) */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Saldo:</label>
                        <input
                            type="number"
                            value={cliente.saldo || 'N/A'}
                            disabled
                            className="border p-2 rounded w-full bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    {/* Campo de Número de Tarjeta VIP (no editable) */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Número de Tarjeta VIP:</label>
                        <input
                            type="text"
                            value={cliente.numero_tarjeta_vip || 'N/A'}
                            disabled
                            className="border p-2 rounded w-full bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    {/* Campo de Referido por (solo muestra si tiene valor) */}
                    {cliente.referido_por && (
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Referido por:</label>
                            <input
                                type="text"
                                value={cliente.referido_por}
                                disabled
                                className="border p-2 rounded w-full bg-gray-100 cursor-not-allowed"
                            />
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
