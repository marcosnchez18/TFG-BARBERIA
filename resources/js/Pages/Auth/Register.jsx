import React from 'react';
import { useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, errors } = useForm({
        nombre: '',  // Cambia de name a nombre
        email: '',
        password: '',
        password_confirmation: '',
        numero_tarjeta_vip: '', // Campo para el número de tarjeta del cliente que refiere
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register.store'));
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-4xl text-center font-bold text-gray-800 mb-6">
                    Regístrate en Barbería
                </h2>
                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-600">Nombre</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                            value={data.nombre}
                            onChange={(e) => setData('nombre', e.target.value)} // Cambia de setData('name') a setData('nombre')
                        />
                        {errors.nombre && <div className="text-red-600 text-sm mt-1">{errors.nombre}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-600">Correo electrónico</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        {errors.email && <div className="text-red-600 text-sm mt-1">{errors.email}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-600">Contraseña</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        {errors.password && <div className="text-red-600 text-sm mt-1">{errors.password}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-600">Confirmar Contraseña</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                        />
                        {errors.password_confirmation && (
                            <div className="text-red-600 text-sm mt-1">{errors.password_confirmation}</div>
                        )}
                    </div>

                    {/* Campo opcional para el número de tarjeta VIP */}
                    <div>
                        <label className="block text-sm font-bold text-gray-600">Número de tarjeta VIP (opcional)</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                            value={data.numero_tarjeta_vip}
                            onChange={(e) => setData('numero_tarjeta_vip', e.target.value)}
                        />
                        {errors.numero_tarjeta_vip && <div className="text-red-600 text-sm mt-1">{errors.numero_tarjeta_vip}</div>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gray-800 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-700 transition duration-300"
                    >
                        Registrarse
                    </button>
                </form>
            </div>
        </div>
    );
}
