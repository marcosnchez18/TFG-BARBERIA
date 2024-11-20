import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import Swal from 'sweetalert2';
import NavigationAdmin from '../Components/NavigationAdmin';
import SobreNosotros from '@/Components/Sobrenosotros';
import Footer from '../Components/Footer';

export default function Candidatos({ candidaturas }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEstado, setFilterEstado] = useState(''); // Estado seleccionado para filtrar
    const [copied, setCopied] = useState(null);


    // Filtrar candidaturas por nombre, email o estado
    const filteredCandidaturas = candidaturas.filter((candidatura) =>
        (candidatura.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidatura.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterEstado === '' || candidatura.estado === filterEstado)
    );

    const cambiarEstado = (id, nuevoEstado) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: `El estado cambiará a "${nuevoEstado}".`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#4CAF50',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, cambiar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                Inertia.patch(route('candidaturas.cambiarEstado', id), { estado: nuevoEstado }, {
                    onSuccess: () => {
                        Swal.fire('Estado cambiado', 'El estado de la candidatura se actualizó correctamente.', 'success');
                    },
                });
            }
        });
    };

    return (
        <div
            style={{
                backgroundImage: `url('/images/barberia.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
            }}
        >
            <NavigationAdmin />
            <br /><br /><br />
            <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-7xl mx-auto">
                <h2 className="text-4xl text-center font-bold text-gray-800 mb-6">Candidaturas de la Oferta</h2>

                {/* Buscar y filtrar candidaturas */}
                <div className="mb-4 flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Buscar por nombre o correo electrónico..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-1/2 p-2 border rounded shadow"
                    />
                    <select
                        value={filterEstado}
                        onChange={(e) => setFilterEstado(e.target.value)}
                        className="w-full md:w-1/4 p-2 border rounded shadow text-gray-700 focus:outline-none focus:ring focus:ring-blue-300"
                    >
                        <option value="">Todos los estados</option>
                        <option value="entregado">Entregado</option>
                        <option value="denegado">Denegado</option>
                        <option value="en bolsa de empleo">En Bolsa de Empleo</option>
                    </select>
                </div>

                {/* Tabla de candidaturas */}
                <div>
                    <table className="table-auto w-full border-collapse border border-gray-300 rounded-lg">
                        <thead>
                            <tr className="bg-[#464242] text-white">
                                <th className="border border-gray-300 px-4 py-2">Nombre</th>
                                <th className="border border-gray-300 px-4 py-2">Email</th>
                                <th className="border border-gray-300 px-4 py-2">Localizador</th>
                                <th className="border border-gray-300 px-4 py-2">Estado</th>
                                <th className="border border-gray-300 px-4 py-2">CV</th>
                                <th className="border border-gray-300 px-4 py-2">Cambiar Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCandidaturas.length > 0 ? (
                                filteredCandidaturas.map((candidatura) => (
                                    <tr key={candidatura.id} className="hover:bg-gray-100">
                                        <td className="border border-gray-300 px-4 py-2 text-center">
                                            {candidatura.nombre}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">
                                            {candidatura.email}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2 text-center relative">
                                            <div className="flex flex-col items-center">
                                                <span>{candidatura.localizador}</span>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(candidatura.localizador).then(() => {
                                                            setCopied(candidatura.id); // Establece el estado de "copiado" para este ID
                                                            setTimeout(() => setCopied(null), 2000); // Resetea el estado después de 2 segundos
                                                        });
                                                    }}
                                                    className="mt-2 text-gray-500 hover:text-blue-600"
                                                    title="Copiar al portapapeles"
                                                >
                                                    {copied === candidatura.id ? (
                                                        <span className="text-green-500">✔ ¡Copiado!</span>
                                                    ) : (
                                                        <i className="fas fa-copy text-lg"></i>
                                                    )}
                                                </button>
                                            </div>
                                        </td>


                                        <td className="border border-gray-300 px-4 py-2 text-center">
                                            <span
                                                className={`inline-block px-2 py-1 rounded ${candidatura.estado === 'entregado'
                                                    ? 'bg-blue-500 text-white'
                                                    : candidatura.estado === 'denegado'
                                                        ? 'bg-red-500 text-white'
                                                        : 'bg-green-500 text-white'
                                                    }`}
                                            >
                                                {candidatura.estado.charAt(0).toUpperCase() + candidatura.estado.slice(1)}
                                            </span>
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">
                                            <a
                                                href={`/storage/${candidatura.cv}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex justify-center items-center"
                                            >
                                                <img
                                                    src="/images/look.png"
                                                    alt="Ver CV"
                                                    className="w-8 h-8 hover:scale-110 transition-transform duration-300"
                                                />
                                            </a>
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">
                                            <select
                                                value={candidatura.estado}
                                                onChange={(e) => cambiarEstado(candidatura.id, e.target.value)}
                                                className="bg-gray-100 border rounded px-2 py-1 text-gray-700 focus:outline-none focus:ring focus:ring-blue-300"
                                            >
                                                <option value="entregado">Entregado</option>
                                                <option value="denegado">Denegado</option>
                                                <option value="en bolsa de empleo">En Bolsa de Empleo</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center text-gray-600 py-4">
                                        No se encontraron candidaturas.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <br /><br /><br />br
            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
            <SobreNosotros />
            <Footer />
        </div>
    );
}
