import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Footer from '../Components/Footer';
import Localizacion from '../Components/Localizacion';
import SobreNosotros from '../Components/Sobrenosotros';
import '../../css/Barber.css';
import NavigationTrab from '@/Components/NavigationTrab';
import WhatsAppButton from '@/Components/Wasa';

export default function Inscripciones({ oferta }) {
    const [isClient, setIsClient] = useState(null);
    const [step, setStep] = useState(0);
    const [gmail, setGmail] = useState('');
    const [password, setPassword] = useState('');
    const [nombre, setNombre] = useState('');
    const [cvFile, setCvFile] = useState(null);
    const [localizador, setLocalizador] = useState(null);


    const validateGmail = () => {
        if (!gmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(gmail)) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, introduce un correo electrónico válido.',
                confirmButtonColor: '#FF5722',
            });
            return false;
        }
        return true;
    };

    const validatePassword = () => {
        if (!password.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, introduce una contraseña.',
                confirmButtonColor: '#FF5722',
            });
            return false;
        }
        return true;
    };

    const validateCV = () => {
        if (!cvFile) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, selecciona un archivo PDF.',
                confirmButtonColor: '#FF5722',
            });
            return false;
        }

        const validFileExtensions = ['pdf'];
        const fileExtension = cvFile.name.split('.').pop().toLowerCase();

        if (!validFileExtensions.includes(fileExtension)) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El archivo debe ser un PDF.',
                confirmButtonColor: '#FF5722',
            });
            return false;
        }

        if (cvFile.size > 2 * 1024 * 1024) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El archivo no debe superar los 2 MB.',
                confirmButtonColor: '#FF5722',
            });
            return false;
        }
        return true;
    };

    const validateNombre = () => {
        if (!nombre.trim() || nombre.length < 3) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, introduce un nombre válido.',
                confirmButtonColor: '#FF5722',
            });
            return false;
        }
        return true;
    };

    const handleGmailSubmit = async () => {
        if (!validateGmail() || !validatePassword()) return;

        try {
            const response = await axios.post('/verificar-cliente', {
                email: gmail,
                password: password,  // Enviar la contraseña al backend
            });

            if (response.data.is_valid) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Cliente verificado!',
                    text: 'Puedes subir tu CV ahora.',
                    confirmButtonColor: '#4CAF50',
                });
                setNombre(response.data.nombre);
                setStep(2); // Cambiar de paso
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Correo o contraseña incorrectos.',
                    confirmButtonColor: '#FF5722',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al verificar al cliente. Inténtalo de nuevo.',
                confirmButtonColor: '#FF5722',
            });
        }
    };

    const handleCvUpload = async () => {
        if (!validateCV()) return;
        if (!isClient && !validateNombre()) return;

        const formData = new FormData();
        formData.append('cv', cvFile);
        formData.append('email', gmail);
        formData.append('oferta_id', oferta.id);
        if (!isClient) formData.append('nombre', nombre);

        try {
            const response = await axios.post('/guardar-candidatura', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.success) {
                setLocalizador(response.data.localizador); // Guardar el localizador generado
                Swal.fire({
                    icon: 'success',
                    title: '¡Candidatura enviada!',
                    text: 'Tu candidatura ha sido registrada con éxito.',
                    confirmButtonColor: '#4CAF50',
                });
                setStep(3);
            } else if (response.data.error === 'already_applied') {
                Swal.fire({
                    icon: 'warning',
                    title: 'Ya registrado',
                    text: 'Ya te has inscrito a esta oferta.',
                    confirmButtonColor: '#FFC107',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo registrar tu candidatura. Inténtalo de nuevo.',
                    confirmButtonColor: '#FF5722',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ya has sido inscrito a esta oferta, puedes inscribirte a otras.',
                confirmButtonColor: '#FF5722',
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300">
            <NavigationTrab />

            {/* Oferta seleccionada */}
            <section className="py-12 bg-white text-center shadow-lg rounded-md mx-4 my-8">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold mb-6 text-gray-800">
                        Inscripción a la oferta: <span className="text-blue-500">{oferta.nombre}</span>
                    </h2>
                    <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-bold text-gray-700 mb-3">Descripción</h3>
                        <p className="text-gray-600">{oferta.descripcion}</p>
                        <ul className="mt-4 text-sm text-gray-600">
                            <li><strong>Duración:</strong> {oferta.duracion_meses} meses</li>
                            <li><strong>Vacantes:</strong> {oferta.numero_vacantes}</li>
                            <li><strong>Máximo Inscripciones:</strong> {oferta.inscripciones_maximas}</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Pregunta inicial: ¿Eres cliente? */}
            {step === 0 && (
                <div className="text-center mt-8 py-10 bg-white mx-4 rounded-lg shadow-lg">
                    <h3 className="text-2xl font-bold text-gray-700 mb-6">¿Eres cliente de Barber's 18?</h3>
                    <div className="flex justify-center gap-8">
                        <button
                            onClick={() => {
                                setIsClient(true);
                                setStep(1);
                            }}
                            className="bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-3 rounded-full shadow-md transform hover:scale-105 transition duration-300"
                        >
                            Sí
                        </button>
                        <button
                            onClick={() => {
                                setIsClient(false);
                                setStep(2);
                            }}
                            className="bg-gradient-to-r from-red-400 to-red-600 text-white px-6 py-3 rounded-full shadow-md transform hover:scale-105 transition duration-300"
                        >
                            No
                        </button>
                    </div>
                </div>
            )}

            {/* Paso 1: Verificar Gmail para clientes */}
            {/* Paso 1: Verificar Gmail para clientes */}
{step === 1 && isClient && (
    <div className="text-center mt-8 py-10 bg-white mx-4 rounded-lg shadow-lg">
        <h3 className="text-2xl font-bold text-gray-700 mb-6">Introduce tu Gmail</h3>

        {/* Formulario en vertical */}
        <div className="flex flex-col items-center gap-4">
            <input
                type="email"
                value={gmail}
                onChange={(e) => setGmail(e.target.value)}
                className="border p-3 rounded w-1/2 text-gray-700 shadow-md focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Introduce tu Gmail"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-3 rounded w-1/2 text-gray-700 shadow-md focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Contraseña"
            />

            {/* Botones */}
            <div className="flex flex-col gap-4 mt-6">
                <button
                    onClick={() => setStep(0)}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-full shadow-md hover:bg-gray-400 transition"
                >
                    Volver Atrás
                </button>
                <button
                    onClick={handleGmailSubmit}
                    className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-full shadow-md transform hover:scale-105 transition duration-300"
                >
                    Verificar
                </button>
            </div>
        </div>
    </div>
)}


            {/* Paso 2: Subir CV */}
            {step === 2 && (
                <div className="text-center mt-8 py-10 bg-white mx-4 rounded-lg shadow-lg">
                    <h3 className="text-2xl font-bold text-blue-500 mb-6">
                        {isClient ? 'Sube tu CV' : 'Completa tus datos y sube tu CV'}
                    </h3>
                    {!isClient && (
                        <>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                className="border p-3 rounded w-1/2 mb-4 text-gray-700 shadow-md focus:outline-none focus:ring focus:ring-blue-300"
                                placeholder="Introduce tu nombre completo"
                            />
                            <br />
                            <input
                                type="email"
                                value={gmail}
                                onChange={(e) => setGmail(e.target.value)}
                                className="border p-3 rounded w-1/2 mb-4 text-gray-700 shadow-md focus:outline-none focus:ring focus:ring-blue-300"
                                placeholder="Introduce tu Gmail"
                            />
                            <br />
                        </>
                    )}
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => setCvFile(e.target.files[0])}
                        className="border p-3 rounded w-1/2 mb-4 text-gray-700 shadow-md focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    <br /><br />
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => setStep(isClient ? 1 : 0)}
                            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-full shadow-md hover:bg-gray-400 transition"
                        >
                            Volver Atrás
                        </button>
                        <button
                            onClick={handleCvUpload}
                            className="bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-3 rounded-full shadow-md transform hover:scale-105 transition duration-300"
                        >
                            Subir CV
                        </button>
                    </div>
                </div>
            )}

            {/* Paso 3: Confirmación */}
            {step === 3 && (
                <div className="text-center mt-12 py-12 bg-gradient-to-r from-green-100 to-blue-100 mx-8 rounded-xl shadow-lg border-4 border-green-500">
                    <h3 className="text-3xl font-extrabold text-green-800 mb-8">
                        ¡Candidatura Registrada!
                    </h3>
                    <p className="text-xl text-gray-800 mb-6">
                        Este es tu localizador:
                    </p>
                    <p className="text-3xl font-bold text-blue-600 bg-white inline-block px-4 py-2 rounded-lg shadow">
                        {localizador}
                    </p>
                    <p className="text-lg text-gray-700 mt-6">
                        Puedes ver el estado de tu candidatura en{' '}
                        <a
                            href="/trabaja-nosotros#consultar-estado"
                            className="text-blue-600 font-bold underline hover:text-blue-800 transition duration-300"
                        >
                            Trabaja con Nosotros
                        </a>.
                    </p>
                    <div className="mt-8">
                        <button
                            onClick={() => (window.location.href = '/trabaja-nosotros')}
                            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition transform duration-300 font-bold"
                        >
                            Ver Estado de Mi Candidatura
                        </button>
                    </div>
                </div>
            )}

            <br />
            <Localizacion />
            <SobreNosotros />
            <Footer />
            <WhatsAppButton />
        </div>
    );
}
