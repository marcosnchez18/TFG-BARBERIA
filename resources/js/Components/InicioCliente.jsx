import React from 'react';
import Swal from 'sweetalert2';
import { Link } from '@inertiajs/react';

export default function InicioCliente({ user }) {
    const mostrarPromocion = () => {
        Swal.fire({
            title: 'Promoción especial',
            text: 'Invita a tus amigos y gana saldo para tus próximas citas. Encontrarás tú número de tarjeta en la sección de tu perfil "Mis Datos" o en tu correo electrónico!',
            imageUrl: '/images/gif.gif',
            imageAlt: 'Promoción de regalo',
            confirmButtonText: '¡Genial!',
            confirmButtonColor: '#3085d6',
            backdrop: `
                rgba(0,0,0,0.4)
                url('/images/confetti.gif')
                left top
                no-repeat
            `,
        });
    };

    return (
        <>
            <header className="inicio-cliente-header">
                <div className="inicio-cliente-bienvenida container mx-auto text-center p-8">
                    <div
                        style={{
                            backgroundColor: 'rgba(255, 248, 240, 0.85)',
                            padding: '1.5rem',
                            borderRadius: '8px',
                            display: 'inline-block',
                        }}
                    >
                        <h2 className="inicio-cliente-titulo text-5xl font-bold text-black">
                            ¡Bienvenido, {user.nombre}!
                        </h2>
                        <p className="inicio-cliente-subtitulo text-lg mt-4 text-black">
                            Nos alegra verte de nuevo. Explora nuestros servicios y gestiona tus citas de manera sencilla.
                        </p>
                    </div>
                </div>
            </header>

            <section className="inicio-cliente-seccion container mx-auto mt-12 p-8">
                <div className="inicio-cliente-opciones flex flex-wrap -mx-4">
                    <div className="inicio-cliente-carta w-full md:w-1/3 p-4">
                        <div className="inicio-cliente-carta-contenedor bg-white rounded-lg shadow-lg p-6 text-center transition-transform hover:scale-105">
                            <h3 className="inicio-cliente-carta-titulo text-2xl font-semibold">Reservar Cita</h3>
                            <p className="inicio-cliente-carta-descripcion mt-2 text-gray-600">
                                Programa una cita con tu barbero de manera rápida.
                            </p>
                            <Link
                                href={route('reservar-cita')}
                                className="inicio-cliente-carta-boton mt-6 bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600"
                            >
                                Reservar Cita
                            </Link>
                        </div>
                    </div>

                    <div className="inicio-cliente-carta w-full md:w-1/3 p-4">
                        <div className="inicio-cliente-carta-contenedor bg-white rounded-lg shadow-lg p-6 text-center transition-transform hover:scale-105">
                            <h3 className="inicio-cliente-carta-titulo text-2xl font-semibold">Mis Citas</h3>
                            <p className="inicio-cliente-carta-descripcion mt-2 text-gray-600">
                                Revisa tus citas anteriores, pendientes y próximas con facilidad.
                            </p>
                            <Link
                                href={route('mis-citas')}
                                className="inicio-cliente-carta-boton mt-6 bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600"
                            >
                                Mis Citas
                            </Link>
                        </div>
                    </div>

                    <div className="inicio-cliente-carta w-full md:w-1/3 p-4">
                        <div className="inicio-cliente-carta-contenedor bg-white rounded-lg shadow-lg p-6 text-center transition-transform hover:scale-105">
                            <h3 className="inicio-cliente-carta-titulo text-2xl font-semibold">Datos personales</h3>
                            <p className="inicio-cliente-carta-descripcion mt-2 text-gray-600">
                                Edita tu perfil, cambia tu correo, etc.
                            </p>
                            <Link
                                href={route('mis-datos')}
                                className="inicio-cliente-carta-boton mt-6 bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600"
                            >
                                Editar Perfil
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="inicio-cliente-seccion-promocion bg-blue-50 py-12 mt-12 text-center">
                <h2 className="inicio-cliente-promocion-titulo text-3xl font-bold text-blue-700">
                    Aprovecha nuestras promociones exclusivas
                </h2>
                <p className="inicio-cliente-promocion-descripcion mt-4 text-blue-600 text-lg">
                    Invita a tus amigos y gana saldo para tus próximas citas. ¡No te lo pierdas!
                </p>
                <button
                    onClick={mostrarPromocion}
                    className="inicio-cliente-promocion-boton mt-6 bg-blue-500 text-white px-8 py-4 rounded-md hover:bg-blue-600"
                    style={{ fontFamily: 'Times New Roman, serif' }}
                >
                    Más información
                </button>
            </section>
        </>
    );
}
