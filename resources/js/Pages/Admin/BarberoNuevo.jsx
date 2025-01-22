import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Link, router } from '@inertiajs/react';
import NavigationAdmin from '../../Components/NavigationAdmin';
import SobreNosotros from '../../Components/Sobrenosotros';
import Footer from '../../Components/Footer';
import Swal from 'sweetalert2';

export default function BarberoNuevo({ storeUrl }) {
    const { data, setData, errors } = useForm({
        nombre: '',
        email: '',
        password: '', // Campo de contraseña
        password_confirmation: '', // Campo de confirmación de contraseña
        imagen: null, // Campo para la imagen
    });

    const [clientErrors, setClientErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false); // Estado para mostrar/ocultar confirmación

    const validateClient = () => {
        const newErrors = {};

        if (!data.nombre) {
            newErrors.nombre = 'El nombre es obligatorio.';
        }

        if (!data.email) {
            newErrors.email = 'El correo electrónico es obligatorio.';
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            newErrors.email = 'Introduce un correo electrónico válido.';
        }

        if (!data.password) {
            newErrors.password = 'La contraseña es obligatoria.';
        } else if (data.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
        }

        if (data.password !== data.password_confirmation) {
            newErrors.password_confirmation = 'Las contraseñas no coinciden.';
        }

        setClientErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submit = async (e) => {
        e.preventDefault();

        if (validateClient()) {
            const formData = new FormData();
            formData.append('nombre', data.nombre);
            formData.append('email', data.email);
            formData.append('password', data.password);
            formData.append('password_confirmation', data.password_confirmation);
            if (data.imagen) {
                formData.append('imagen', data.imagen);
            }

            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'); //token

            try {
                const response = await fetch(storeUrl, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-CSRF-TOKEN': csrfToken, // Incluye el token CSRF para evitar errores 419
                    },
                });

                if (!response.ok) {
                    throw new Error('Error en el registro del barbero.');
                }

                Swal.fire({
                    title: 'Barbero registrado',
                    text: 'El barbero ha sido creado exitosamente.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                }).then(() => {
                    router.visit('/mi-gestion-admin');
                });
            } catch (error) {
                console.error(error);
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al registrar el barbero. Por favor, inténtalo de nuevo.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                });
            }
        }
    };

    return (
        <div className="min-h-screen bg-cover bg-center relative" style={{ backgroundImage: "url('/images/barberia.jpg')" }}>
            <NavigationAdmin />

            <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg w-full max-w-md mx-auto mt-20 relative">
                <div className="absolute top-2 right-2">
                    <Link href="/opciones" className="text-black-600 text-xl font-bold hover:text-gray-400">✕</Link>
                </div>

                <h2 className="text-4xl text-center font-bold text-gray-800 mb-6" style={{ fontFamily: 'Times New Roman, serif' }}>
                    Alta Barbero
                </h2>

                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-600">Nombre</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
                            value={data.nombre}
                            onChange={(e) => setData('nombre', e.target.value)}
                        />
                        {clientErrors.nombre && <div className="text-red-600 text-sm mt-1">{clientErrors.nombre}</div>}
                        {errors.nombre && <div className="text-red-600 text-sm mt-1">{errors.nombre}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-600">Correo electrónico</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        {clientErrors.email && <div className="text-red-600 text-sm mt-1">{clientErrors.email}</div>}
                        {errors.email && <div className="text-red-600 text-sm mt-1">{errors.email}</div>}
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-bold text-gray-600">Contraseña</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <div
                            className="text-sm text-blue-500 cursor-pointer mt-2"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        </div>
                        {clientErrors.password && <div className="text-red-600 text-sm mt-1">{clientErrors.password}</div>}
                        {errors.password && <div className="text-red-600 text-sm mt-1">{errors.password}</div>}
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-bold text-gray-600">Confirmar Contraseña</label>
                        <input
                            type={showPasswordConfirm ? 'text' : 'password'}
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                        />
                        <div
                            className="text-sm text-blue-500 cursor-pointer mt-2"
                            onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                        >
                            {showPasswordConfirm ? 'Ocultar confirmación' : 'Mostrar confirmación'}
                        </div>
                        {clientErrors.password_confirmation && <div className="text-red-600 text-sm mt-1">{clientErrors.password_confirmation}</div>}
                        {errors.password_confirmation && (
                            <div className="text-red-600 text-sm mt-1">{errors.password_confirmation}</div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-600">Foto</label>
                        <input
                            type="file"
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
                            accept="image/*"
                            onChange={(e) => setData('imagen', e.target.files[0])}
                        />
                        {errors.imagen && <div className="text-red-600 text-sm mt-1">{errors.imagen}</div>}
                    </div>

                    <button
                        type="submit"
                        className="w-full font-bold py-2 px-4 rounded-md hover:opacity-90 transition duration-300"
                        style={{ backgroundColor: '#CFA15D', color: '#171717' }}
                    >
                        Registrar Barbero
                    </button>
                </form>
            </div>
            <br /><br /><br /><br /><br />
            <SobreNosotros />
            <Footer />
        </div>
    );
}
