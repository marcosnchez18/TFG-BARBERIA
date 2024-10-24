import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import Navigation from '../../Components/Navigation';

export default function ForgotPassword() {
    const { data, setData, post, errors } = useForm({
        email: '',
    });

    const [status, setStatus] = useState('');
    const [clientErrors, setClientErrors] = useState({});

    // Función de validación del lado del cliente
    const validateClient = () => {
        const newErrors = {};

        // Validar el correo electrónico
        if (!data.email) {
            newErrors.email = 'El correo electrónico es obligatorio.';
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            newErrors.email = 'Introduce un correo electrónico válido.';
        }

        setClientErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Devuelve true si no hay errores
    };

    const submit = (e) => {
        e.preventDefault();

        // Verificar validaciones del lado del cliente
        if (validateClient()) {
            post(route('password.email'), {
                onSuccess: () => setStatus('Enlace de restablecimiento enviado, por favor, revise su correo electrónico.'),
            });
        }
    };

    return (
        <div className="min-h-screen bg-cover bg-center relative" style={{ backgroundImage: "url('/images/barberia.jpg')" }}>
            <Navigation />

            <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg w-full max-w-md mx-auto mt-20 relative">
                <h2 className="text-4xl text-center font-bold text-gray-800 mb-6">
                    Restablecer Contraseña
                </h2>

                {status && <div className="text-green-500 text-center mb-6">{status}</div>}

                <form onSubmit={submit} className="space-y-6">
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

                    <button
                        type="submit"
                        className="w-full font-bold py-2 px-4 rounded-md hover:opacity-90 transition duration-300"
                        style={{ backgroundColor: '#CFA15D', color: '#171717' }}
                    >
                        Enviar enlace de restablecimiento
                    </button>
                </form>
            </div>
        </div>
    );
}
