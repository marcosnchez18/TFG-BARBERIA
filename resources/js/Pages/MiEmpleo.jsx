import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import NavigationCliente from '../Components/NavigationCliente';
import WhatsAppButton from '@/Components/Wasa';
import SobreNosotros from '@/Components/Sobrenosotros';
import Footer from '../Components/Footer';

export default function MisEmpleo() {
    const [candidaturas, setCandidaturas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Recuperar las candidaturas del cliente
    useEffect(() => {
        axios.get('/api/candidaturas')
            .then(response => {
                console.log(response.data);
                setCandidaturas(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error al recuperar las candidaturas:", error);
                setError("Hubo un problema al cargar tus candidaturas.");
                setLoading(false);
            });
    }, []);

    // Manejar la eliminación de una candidatura
    const handleDelete = (localizador) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'No podrás recuperar esta candidatura si la eliminas.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`/api/candidaturas/${localizador}`)
                    .then(() => {
                        setCandidaturas(candidaturas.filter((c) => c.localizador !== localizador));
                        Swal.fire('Eliminada', 'La candidatura ha sido eliminada exitosamente.', 'success');
                    })
                    .catch((error) => {
                        console.error('Error al eliminar la candidatura:', error);
                        Swal.fire('Error', 'Hubo un problema al eliminar la candidatura.', 'error');
                    });
            }
        });
    };

    const getEstadoClass = (estado) => {
        switch (estado.toLowerCase()) {
            case 'entregado':
                return 'text-blue-600 font-bold';
            case 'denegado':
                return 'text-red-600 font-bold';
            case 'bolsa de empleo':
                return 'text-green-600 font-bold';
            default:
                return 'text-gray-700'; // Clase predeterminada
        }
    };



    return (
        <div>
            <NavigationCliente />
            <div
                style={{
                    backgroundImage: `url('/images/barberia.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '100vh',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'New Times Roman'
                }}
            >
                <br /><br /><br /><br />
                <div className="max-w-7xl mx-auto p-8 bg-white bg-opacity-80 rounded-xl shadow-lg">
                    <h2 className="mis-datos-cliente-title">Mis Candidaturas</h2>

                    {/* Mostrar error si existe */}
                    {error && (
                        <div className="text-red-500 text-center py-4">
                            {error}
                        </div>
                    )}

                    {/* Mostrar cargando si está en espera */}
                    {loading ? (
                        <div className="text-center py-4 text-gray-500">Cargando tus candidaturas...</div>
                    ) : (
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                            <thead>
                                <tr className="border-b bg-gray-100">
                                    <th className="py-3 px-6 text-left text-yellow-600">Oferta</th>
                                    <th className="py-3 px-6 text-left text-yellow-600">Localizador</th>
                                    <th className="py-3 px-6 text-left text-yellow-600">Estado</th>
                                    <th className="py-3 px-6 text-left text-yellow-600">Fecha de Inscripción</th>
                                    <th className="py-3 px-6 text-left text-yellow-600">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {candidaturas.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 px-6 text-gray-500">
                                            No tienes candidaturas activas.
                                        </td>
                                    </tr>
                                ) : (
                                    candidaturas.map(candidatura => (
                                        <tr key={candidatura.localizador} className="border-b hover:bg-gray-50 transition">
                                            <td className="py-4 px-6 text-black-700">{candidatura.oferta_nombre}</td>
                                            <td className="py-4 px-6 text-green-700">{candidatura.localizador}</td>
                                            <td className={`py-4 px-6 ${getEstadoClass(candidatura.estado)}`}>
                                                {candidatura.estado}
                                            </td>
                                            <td className="py-4 px-6 text-gray-700">
                                                {new Date(candidatura.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="py-4 px-6">
                                                <button
                                                    onClick={() => handleDelete(candidatura.localizador)}
                                                    className="text-red-600 hover:text-red-800 font-semibold"
                                                >
                                                    <i className="fas fa-trash-alt"></i> {/* Icono de papelera */}
                                                </button>

                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>

                        </table>
                    )}
                </div>
            </div>
            <SobreNosotros />
            <Footer />
            <WhatsAppButton />
        </div>
    );
}
