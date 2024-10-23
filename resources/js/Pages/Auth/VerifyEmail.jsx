import React from 'react';
import { useForm, usePage } from '@inertiajs/react';

export default function VerifyEmail() {
    const { status } = usePage().props;
    const { post, processing } = useForm();

    const handleResendVerification = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    const handleLogout = (e) => {
        e.preventDefault();
        post(route('logout'), {
            onSuccess: () => window.location.href = route('login'), // Redirige al login después de cerrar sesión
        });
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
            <div className="bg-neutral-900 p-8 rounded-lg shadow-2xl max-w-lg w-full text-center relative">

                {/* Título */}
                <h1 className="text-3xl font-extrabold text-white mb-6">
                    ¡Ya casi está todo!
                </h1>

                {/* Icono decorativo (pirulo de barbería) */}
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                    <img src="/images/barber-pole.png" alt="Pirulo de Barbería" className="w-16 h-16"/>
                </div>

                <p className="text-gray-300 text-lg mb-8">
                    ¡Gracias por registrarte! Por favor, revisa tu correo electrónico y confirma tu dirección para completar el proceso.
                </p>

                {/* Mensaje de reenvío del enlace */}
                {status === 'verification-link-sent' && (
                    <div className="mb-4 text-yellow-400 text-lg">
                        Un nuevo enlace de verificación ha sido enviado a tu correo electrónico.
                    </div>
                )}

                {/* Botón para reenviar enlace de verificación */}
                <form onSubmit={handleResendVerification} className="mb-8">
                    <button
                        type="submit"
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out"
                        disabled={processing}
                    >
                        Reenviar enlace de verificación
                    </button>
                </form>

                {/* Botón para cerrar sesión e ir al login */}
                <form method="POST" onSubmit={handleLogout} className="text-center">
                    <button
                        type="submit"
                        className="w-full text-yellow-500 hover:text-yellow-600 underline text-lg transition duration-300 ease-in-out"
                    >
                        Iniciar sesión
                    </button>
                </form>
            </div>

            {/* Elemento decorativo en el fondo */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-center mb-8">
                <img src="/images/barber-tools.png" alt="Herramientas de Barbería" className="w-40 opacity-10"/>
            </div>
        </div>
    );
}
