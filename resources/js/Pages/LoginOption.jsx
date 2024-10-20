import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';

export default function LoginOption() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
        role: 'cliente'  // Este campo se usará para definir si es cliente o barbero
    });

    // Controlamos el estado del tipo de usuario (cliente o barbero)
    const [isBarbero, setIsBarbero] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        // Cambiar el rol a 'admin' si se selecciona iniciar sesión como barbero
        setData('role', isBarbero ? 'admin' : 'cliente');
        post(route('login.authenticate'));
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Iniciar sesión</h2>

                <div className="mb-4">
                    <button
                        className={`mr-4 ${!isBarbero ? 'font-bold' : ''}`}
                        onClick={() => setIsBarbero(false)}
                    >
                        Iniciar sesión como cliente
                    </button>
                    <button
                        className={isBarbero ? 'font-bold' : ''}
                        onClick={() => setIsBarbero(true)}
                    >
                        Iniciar sesión como barbero
                    </button>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700">Email</label>
                        <input
                            id="email"
                            type="email"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        {errors.email && <div className="text-red-600 mt-1">{errors.email}</div>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700">Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        {errors.password && <div className="text-red-600 mt-1">{errors.password}</div>}
                    </div>

                    <div className="flex items-center">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="remember"
                                className="form-checkbox"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                            />
                            <span className="ml-2 text-gray-600">Recuérdame</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-4 bg-blue-500 text-white p-2 rounded-md"
                        disabled={processing}
                    >
                        Iniciar sesión
                    </button>
                </form>
            </div>
        </div>
    );
}
