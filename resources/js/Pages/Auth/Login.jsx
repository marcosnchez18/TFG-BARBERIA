import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import Navigation from '../../Components/Navigation';
import Localizacion from '../../Components/Localizacion';
import WhatsAppButton from '../../Components/Wasa';
import SobreNosotros from '../../Components/Sobrenosotros';
import Footer from '../../Components/Footer';

export default function Login() {
    const { data, setData, post, errors } = useForm({
        email: localStorage.getItem('lastLoggedInEmail') || '',
        password: '',
        remember: false,
    });

    const [clientErrors, setClientErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const lastEmail = localStorage.getItem('lastLoggedInEmail');
        if (lastEmail) setData('email', lastEmail);
    }, []);

    const validateClient = () => {
        const newErrors = {};

        if (!data.email) {
            newErrors.email = 'El correo electrónico es obligatorio.';
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            newErrors.email = 'Introduce un correo electrónico válido.';
        }

        if (!data.password) {
            newErrors.password = 'La contraseña es obligatoria.';
        } else if (data.password.length < 4) {
            newErrors.password = 'La contraseña debe tener al menos 4 caracteres.';
        }

        setClientErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submit = (e) => {
        e.preventDefault();

        if (validateClient()) {
            post(route('login.authenticate'), {
                onSuccess: () => {
                    if (data.remember) {
                        localStorage.setItem('lastLoggedInEmail', data.email);
                    } else {
                        localStorage.removeItem('lastLoggedInEmail');
                    }
                },
            });
        }
    };

    return (
        <div className="min-h-screen bg-cover bg-center relative" style={{ backgroundImage: "url('/images/barberia.jpg')" }}>
            <Navigation />
            <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg w-full max-w-md mx-auto mt-20 relative">
                <div className="absolute top-2 right-2">
                    <Link href="/" className="text-black-600 text-xl font-bold hover:text-gray-400">✕</Link>
                </div>
                <h2 className="text-4xl text-center font-bold text-gray-800 mb-6" style={{ fontFamily: 'Times New Roman, serif' }}>
                    Bienvenido
                </h2>
                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-600" style={{ fontFamily: 'Times New Roman, serif' }}>Correo electrónico</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        {clientErrors.email && <div className="text-red-600 text-sm mt-1">{clientErrors.email}</div>}
                        {errors.email && <div className="text-red-600 text-sm mt-1">{errors.email}</div>}
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-bold text-gray-600" style={{ fontFamily: 'Times New Roman, serif' }}>Contraseña</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <div
                            className="mt-2 text-sm text-blue-500 cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        </div>
                        {clientErrors.password && <div className="text-red-600 text-sm mt-1">{clientErrors.password}</div>}
                        {errors.password && <div className="text-red-600 text-sm mt-1">{errors.password}</div>}
                    </div>

                    {/* Casilla de Recuérdame */}
                    <div className="flex items-center mt-4">
                        <input
                            type="checkbox"
                            id="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="mr-2"
                        />
                        <label htmlFor="remember" className="text-sm text-gray-600">Recuérdame</label>
                    </div>

                    <button
                        type="submit"
                        className="w-full font-bold py-2 px-4 rounded-md hover:opacity-90 transition duration-300"
                        style={{ backgroundColor: '#CFA15D', color: '#171717' }}
                    >
                        Iniciar sesión
                    </button>
                </form>

                {/* Acceso como Invitado */}
                <div className="mt-6 text-center">
                    <Link
                        href="/invitado"
                        className="w-full inline-block font-bold py-2 px-4 rounded-md hover:opacity-90 transition duration-300"
                        style={{ backgroundColor: '#E0E0E0', color: '#171717' }}
                    >
                        Acceso como invitado
                    </Link>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-gray-500" style={{ fontFamily: 'Times New Roman, serif' }}>¿No tienes cuenta?</p>
                    <Link href="/register" className="text-blue-500 hover:underline" style={{ fontFamily: 'Times New Roman, serif' }}>
                        Registrarse aquí
                    </Link>
                </div>

                <div className="mt-4 text-center">
                    <Link href={route('password.request')} className="text-blue-500 hover:underline">¿Olvidaste tu contraseña?</Link>
                </div>
            </div>
            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
            <Localizacion />
            <SobreNosotros />
            <Footer />
            <WhatsAppButton />
        </div>
    );
}
