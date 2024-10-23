import React, { useEffect, useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';

export default function VerifyEmail() {
    const { status } = usePage().props;
    const { post, processing } = useForm();
    const [timer, setTimer] = useState(30); // Temporizador inicial en segundos

    const handleResendVerification = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    const handleLogout = (e) => {
        e.preventDefault();
        post(route('logout'), {
            onSuccess: () => window.location.href = route('login'),
        });
    };

    // Hook para controlar el temporizador
    useEffect(() => {
        if (timer > 0) {
            const intervalId = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000); // Reduce el temporizador cada segundo

            return () => clearInterval(intervalId); // Limpia el intervalo al desmontar el componente
        } else {
            // Redirigir al usuario al login cuando el temporizador llegue a 0
            post(route('logout'), {
                onSuccess: () => window.location.href = route('login'),
            });
        }
    }, [timer, post]);

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-amber-20">
            <div className="bg-amber-50 p-8 rounded-lg shadow-xl max-w-lg w-full text-center relative border border-gray-700">

                {/* Título */}
                <h1 className="text-4xl font-bold text-black-100 mb-6 tracking-widest">
                    ¡Ya casi está!
                </h1>

                <p className="text-black-400 text-lg mb-8">
                    ¡Gracias por registrarte! Por favor, revisa tu correo y confirma tu dirección para completar el proceso.
                </p>

                {/* Mensaje de reenvío del enlace */}
                {status === 'verification-link-sent' && (
                    <div className="mb-4 text-red-500 text-lg">
                        Un nuevo enlace de verificación ha sido enviado a tu correo.
                    </div>
                )}

                {/* Botón para reenviar enlace de verificación */}
                <form onSubmit={handleResendVerification} className="mb-8">
                    <button
                        type="submit"
                        className="w-full bg-yellow-600 hover:bg-yellow-700 text-gray-100 font-semibold py-2 px-4 rounded-md shadow-lg transition duration-300 ease-in-out"
                        disabled={processing}
                    >
                        Reenviar enlace de verificación
                    </button>
                </form>

                {/* Temporizador */}
                <p className="text-blue-900 text-lg mb-4">
                    Serás redirigido al login en {timer} segundos...
                </p>

                {/* Botón para cerrar sesión e ir al login */}
                <form method="POST" onSubmit={handleLogout} className="text-center">
                    <button
                        type="submit"
                        className="w-full text-black-500 hover:text-red-600 underline text-lg transition duration-300 ease-in-out"
                    >
                        Iniciar sesión
                    </button>
                </form>
            </div>
        </div>
    );
}
