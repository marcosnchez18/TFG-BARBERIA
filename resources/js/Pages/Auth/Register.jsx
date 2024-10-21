import React from 'react';
import { useForm } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import Navigation from '../../Components/Navigation'; // Asegúrate de que la ruta sea correcta
import Localizacion from '../../Components/Localizacion';
import WhatsAppButton from '../../Components/Wasa'; // Componente del botón flotante de WhatsApp
import SobreNosotros from '../../Components/Sobrenosotros';
import Footer from '../../Components/Footer'; // Asegúrate de que la ruta sea correcta

export default function Register() {
    const { data, setData, post, errors } = useForm({
        nombre: '',  // Cambiado de "name" a "nombre"
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
        <div className="min-h-screen bg-cover bg-center relative" style={{ backgroundImage: "url('/images/barberia.jpg')" }}>
            {/* Componente de navegación */}
            <Navigation />

            <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg w-full max-w-md mx-auto mt-20 relative">
                {/* Botón de cierre (X) dentro del cuadro de registro */}
                <div className="absolute top-2 right-2">
                    <Link href="/" className="text-black-600 text-xl font-bold hover:text-gray-400">✕</Link>
                </div>

                <h2 className="text-4xl text-center font-bold text-gray-800 mb-6" style={{ fontFamily: 'Times New Roman, serif' }}>
                    Regístrate
                </h2>
                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-600" style={{ fontFamily: 'Times New Roman, serif' }}>Nombre</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                            value={data.nombre}
                            onChange={(e) => setData('nombre', e.target.value)}
                        />
                        {errors.nombre && <div className="text-red-600 text-sm mt-1">{errors.nombre}</div>}
                    </div>

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

                    <div>
                        <label className="block text-sm font-bold text-gray-600" style={{ fontFamily: 'Times New Roman, serif' }}>Confirmar Contraseña</label>
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
                        <label className="block text-sm font-bold text-red-600" style={{ fontFamily: 'Times New Roman, serif' }}>¿Tienes algún código?</label>
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
                        className="w-full font-bold py-2 px-4 rounded-md hover:opacity-90 transition duration-300"
                        style={{ backgroundColor: '#CFA15D', color: '#171717' }} // Color del botón y del texto
                    >
                        Registrarse
                    </button>
                </form>
            </div>

            {/* Sección de Localización y Sobre Nosotros */}
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
