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
        <div className="min-h-screen flex flex-col justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h1 className="text-2xl font-bold text-center mb-4">Verifica tu dirección de correo electrónico</h1>
                <p className="text-center mb-6">
                    Antes de continuar, por favor revisa tu correo electrónico y haz clic en el enlace de verificación.
                </p>

                {status === 'verification-link-sent' && (
                    <div className="mb-4 text-green-600 text-center">
                        Un nuevo enlace de verificación ha sido enviado a tu dirección de correo electrónico.
                    </div>
                )}

                <form onSubmit={handleResendVerification} className="text-center">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                        disabled={processing}
                    >
                        Reenviar enlace de verificación
                    </button>
                </form>

                <form method="POST" onSubmit={handleLogout} className="mt-6 text-center">
                    <button type="submit" className="text-red-600 underline">
                        Iniciar sesión
                    </button>
                </form>
            </div>
        </div>
    );
}
