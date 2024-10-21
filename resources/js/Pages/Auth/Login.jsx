import React from 'react';
import { useForm } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import Navigation from '../../Components/Navigation'; // Asegúrate de que la ruta sea correcta
import Localizacion from '../../Components/Localizacion';
import WhatsAppButton from '../../Components/Wasa'; // Componente del botón flotante de WhatsApp
import SobreNosotros from '../../Components/Sobrenosotros';
import Footer from '../../Components/Footer'; // Asegúrate de que la ruta sea correcta

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
        <div className="min-h-screen bg-cover bg-center relative" style={{ backgroundImage: "url('/images/barberia.jpg')" }}>
            {/* Componente de navegación */}
            <Navigation />

            <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg w-full max-w-md mx-auto mt-20 relative">
                {/* Botón de cierre (X) dentro del cuadro de login */}
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
                        {errors.email && <div className="text-red-600 text-sm mt-1">{errors.email}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-600" style={{ fontFamily: 'Times New Roman, serif' }}>Contraseña</label>
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
                        className="w-full font-bold py-2 px-4 rounded-md hover:opacity-90 transition duration-300"
                        style={{ backgroundColor: '#CFA15D', color: '#171717' }} // Color del botón y del texto
                    >
                        Iniciar sesión
                    </button>
                </form>

                {/* Opción para registrarse */}
                <div className="mt-6 text-center">
                    <p className="text-gray-500" style={{ fontFamily: 'Times New Roman, serif' }}>¿No tienes cuenta?</p>
                    <Link href="/register" className="text-blue-500 hover:underline" style={{ fontFamily: 'Times New Roman, serif' }}>
                        Registrarse aquí
                    </Link>
                </div>
            </div>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            <Localizacion />
            <SobreNosotros />

            {/* Footer */}
            <Footer />

            {/* Botón flotante de WhatsApp */}
            <WhatsAppButton />
        </div>
    );
}
