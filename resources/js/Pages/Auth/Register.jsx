import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import Navigation from '../../Components/Navigation';
import Localizacion from '../../Components/Localizacion';
import WhatsAppButton from '../../Components/Wasa';
import SobreNosotros from '../../Components/Sobrenosotros';
import Footer from '../../Components/Footer';

export default function Register() {
    const { data, setData, post, errors } = useForm({
        nombre: '',
        email: '',
        password: '',
        password_confirmation: '',
        numero_tarjeta_vip: '',
    });

    // Estado para errores del lado del cliente
    const [clientErrors, setClientErrors] = useState({});

    // Función de validación del lado del cliente
    const validateClient = () => {
        const newErrors = {};

        // Validar el nombre
        if (!data.nombre) {
            newErrors.nombre = 'El nombre es obligatorio.';
        }

        // Validar el correo electrónico
        if (!data.email) {
            newErrors.email = 'El correo electrónico es obligatorio.';
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            newErrors.email = 'Introduce un correo electrónico válido.';
        }

        // Validar la contraseña
        if (!data.password) {
            newErrors.password = 'La contraseña es obligatoria.';
        } else if (data.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
        }

        // Validar la confirmación de la contraseña
        if (data.password !== data.password_confirmation) {
            newErrors.password_confirmation = 'Las contraseñas no coinciden.';
        }

        setClientErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Si no hay errores, devuelve true
    };

    const submit = (e) => {
        e.preventDefault();

        // Verificamos las validaciones del lado del cliente
        if (validateClient()) {
            post(route('register.store')); // Enviar el formulario si las validaciones pasan
        }
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
                        {clientErrors.nombre && <div className="text-red-600 text-sm mt-1">{clientErrors.nombre}</div>}
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
                        {clientErrors.email && <div className="text-red-600 text-sm mt-1">{clientErrors.email}</div>}
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
                        {clientErrors.password && <div className="text-red-600 text-sm mt-1">{clientErrors.password}</div>}
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
                        {clientErrors.password_confirmation && <div className="text-red-600 text-sm mt-1">{clientErrors.password_confirmation}</div>}
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
                        {clientErrors.numero_tarjeta_vip && <div className="text-red-600 text-sm mt-1">{clientErrors.numero_tarjeta_vip}</div>}
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
