import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import NavigationCliente from '../../Components/NavigationCliente';
import WhatsAppButton from '@/Components/Wasa';
import SobreNosotros from '@/Components/Sobrenosotros';
import Footer from '../../Components/Footer';
import TablaCandidaturas from '../../Components/TablaCandidaturas';

export default function MisEmpleo() {
    const [candidaturas, setCandidaturas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('/api/candidaturas')
            .then((response) => {
                console.log(response.data);
                setCandidaturas(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error al recuperar las candidaturas:', error);
                setError('Hubo un problema al cargar tus candidaturas.');
                setLoading(false);
            });
    }, []);

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
                    fontFamily: 'New Times Roman',
                }}
            >
                <br />
                <br />
                <br />
                <br />
                <div className="max-w-7xl mx-auto p-8 bg-white bg-opacity-80 rounded-xl shadow-lg">
                    <h2 className="mis-datos-cliente-title">Mis Candidaturas</h2>

                    {error && (
                        <div className="text-red-500 text-center py-4">{error}</div>
                    )}

                    {loading ? (
                        <div className="text-center py-4 text-gray-500">
                            Cargando tus candidaturas...
                        </div>
                    ) : (
                        <TablaCandidaturas
                            candidaturas={candidaturas}
                            handleDelete={handleDelete}
                        />
                    )}
                </div>
            </div>
            <SobreNosotros />
            <Footer />
            <WhatsAppButton />
        </div>
    );
}
