import React from 'react';
import NavigationCliente from '../Components/NavigationCliente';
import WhatsAppButton from '@/Components/Wasa';
import SobreNosotros from '@/Components/Sobrenosotros';
import Footer from '../Components/Footer';
import { Inertia } from '@inertiajs/inertia';
import '../../css/Barber.css';

export default function ReservarCitaCliente({ noticias }) {
    return (
        <div style={{
            backgroundImage: "url('/images/barberia.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh',
        }}>
            <NavigationCliente />
            <br />
            <div className="container mx-auto p-8 bg-white bg-opacity-80 rounded-lg mt-10">
                <h2 className="text-4xl font-bold text-center mb-6">Noticias</h2>

                {/* Mostrar noticias con estilo épico */}
                <div className="epic-noticias-container">

                    {noticias && noticias.length > 0 ? (
                        noticias.map((noticia) => (
                            <div key={noticia.id} className="epic-noticia-card">
                                <h3 className="epic-noticia-title text-xl font-semibold">{noticia.titulo}</h3>
                                <p className="epic-noticia-content">{noticia.contenido}</p>
                                <small className="epic-noticia-author">Publicado por: {noticia.usuario.nombre}</small>
                            </div>
                        ))
                    ) : (
                        <p className="epic-noticia-empty">No hay noticias disponibles en este momento.</p>
                    )}
                </div>

                {/* Botón para pedir cita */}
                <div className="text-center mt-10">
                <button
    onClick={() => Inertia.visit(route('mis-citas-elegir'))}

    className="boton_lugar"
>
    Pedir Cita
</button>

                </div>
            </div>
            <br /><br />
            <SobreNosotros />
            <Footer />
            <WhatsAppButton />
        </div>
    );
}

