import React from 'react';
import Swal from 'sweetalert2';

export default function TablaCandidaturas({ candidaturas, handleDelete }) {
    const getEstadoClass = (estado) => {
        switch (estado.toLowerCase()) {
            case 'entregado':
                return 'text-blue-600 font-bold';
            case 'denegado':
                return 'text-red-600 font-bold';
            case 'bolsa de empleo':
                return 'text-green-600 font-bold';
            default:
                return 'text-gray-700';
        }
    };

    return (
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
                    candidaturas.map((candidatura) => (
                        <tr
                            key={candidatura.localizador}
                            className="border-b hover:bg-gray-50 transition"
                        >
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
                                    <i className="fas fa-trash-alt"></i>
                                </button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
}
