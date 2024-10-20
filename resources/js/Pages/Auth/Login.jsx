import React from 'react';
import { useForm } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, errors } = useForm({
        email: '',
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login.authenticate'));
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-4xl text-center font-bold text-gray-800 mb-6">
                    Bienvenido a Barbería
                </h2>
                <form onSubmit={submit} className="space-y-6">
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

                    <button
                        type="submit"
                        className="w-full bg-gray-800 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-700 transition duration-300"
                    >
                        Iniciar sesión
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-gray-500">¿No tienes cuenta?</p>
                    <a href="/register" className="text-blue-500 hover:underline">Registrarse aquí</a>
                </div>
            </div>
        </div>
    );
}
