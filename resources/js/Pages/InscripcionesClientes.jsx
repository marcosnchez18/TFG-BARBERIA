
import axios from 'axios';
import Swal from 'sweetalert2';
import Footer from '../Components/Footer';
import React, { useState, useEffect } from 'react';  // Importa useEffect
import Localizacion from '../Components/Localizacion';
import SobreNosotros from '../Components/Sobrenosotros';
import '../../css/Barber.css';
import NavigationCliente from '@/Components/NavigationCliente';
import WhatsAppButton from '@/Components/Wasa';

export default function InscripcionesClientes({ oferta }) {
    const [step, setStep] = useState(0);
    const [cvFile, setCvFile] = useState(null);
    const [localizador, setLocalizador] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const getUserData = async () => {
            try {
                const response = await axios.get('/usuario-actual');
                setUser(response.data);
            } catch (error) {
                console.error('Error al obtener los datos del usuario:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo obtener la información del usuario. Asegúrate de estar autenticado.',
                    confirmButtonColor: '#FF5722',
                });
            }
        };

        getUserData();
    }, []);


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

    const handleCvUpload = async () => {
        if (!validateCV()) return;

        const formData = new FormData();
        formData.append('cv', cvFile);
        formData.append('email', user.email);
        formData.append('user_id', user.id);
        formData.append('nombre', user.nombre);
        formData.append('oferta_id', oferta.id);

        try {
            const response = await axios.post('/guardar-candidatura-user', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.success) {
                setLocalizador(response.data.localizador);
                Swal.fire({
                    icon: 'success',
                    title: '¡Candidatura enviada!',
                    text: 'Tu candidatura ha sido registrada con éxito.',
                    confirmButtonColor: '#4CAF50',
                });
                setStep(1);
            } else if (response.data.error === 'already_applied') {
                Swal.fire({
                    icon: 'warning',
                    title: 'Ya registrado',
                    text: 'Ya te has inscrito a esta oferta.',
                    confirmButtonColor: '#FF5722',
                });
                setStep(1);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un error al registrar tu candidatura. Por favor, intenta de nuevo.',
                    confirmButtonColor: '#FF5722',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'UPS !!',
                text: 'Ya te has inscrito a esta oferta.',
                confirmButtonColor: '#FF5722',
            });
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300">
            <NavigationCliente />

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
                            
                        </ul>
                    </div>
                </div>
            </section>

            {step === 0 && (
                <div className="text-center mt-8 py-10 bg-white mx-4 rounded-lg shadow-lg">
                    <h3 className="text-2xl font-bold text-blue-500 mb-6">Adjunte su CV
                    </h3>
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => setCvFile(e.target.files[0])}
                        className="border p-3 rounded w-1/2 mb-4 text-gray-700 shadow-md focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    <br /><br />
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={handleCvUpload}
                            className="bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-3 rounded-full shadow-md transform hover:scale-105 transition duration-300"
                        >
                            Subir CV
                        </button>
                    </div>
                </div>
            )}


            {step === 1 && (
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
                    <div className="mt-8">

                        <button
                            type="button"
                            onClick={() => {
                                window.open('/miempleo', '_blank');
                            }}
                            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition transform duration-300 font-bold"
                        >
                            Ver mis candidaturas
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
