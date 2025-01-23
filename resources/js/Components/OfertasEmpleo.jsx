import React from 'react';

export default function OfertasEmpleo({ ofertas }) {
    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-6">
                <h2 className="text-5xl font-extrabold mb-8 text-center text-blue-900">
                    Ofertas de Empleo Disponibles
                </h2>

                {ofertas && ofertas.length > 0 ? (
                    <div
                        className={`grid ${ofertas.length === 1
                                ? 'justify-center'
                                : ofertas.length === 2
                                    ? 'grid-cols-2'
                                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                            } gap-8`}
                    >
                        {ofertas.map((oferta) => (
                            <div key={oferta.id} className="bg-white p-6 rounded-lg shadow-lg">
                                <h3 className="text-xl font-bold text-gray-700 mb-3">
                                    {oferta.nombre}
                                </h3>
                                <p className="text-gray-600">
                                    {oferta.descripcion.split(' ').map((word, index) =>
                                        ['experiencia', 'barbero', 'temporada'].includes(word.toLowerCase()) ? (
                                            <strong key={index}>{word} </strong>
                                        ) : (
                                            `${word} `
                                        )
                                    )}
                                </p>
                                <ul className="mt-4 text-sm text-gray-600">
                                    <li>
                                        <strong>Duración:</strong> {oferta.duracion_meses} meses
                                    </li>
                                    <li>
                                        <strong>Vacantes:</strong> {oferta.numero_vacantes}
                                    </li>
                                </ul>
                                <button
                                    onClick={() => window.open(`/inscribirsecliente/${oferta.id}`, '_blank')}
                                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Inscribirse
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-600">
                        Actualmente no hay ofertas disponibles. Vuelve pronto.
                    </p>
                )}
            </div>
        </section>
    );
}
