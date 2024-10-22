import React from 'react';
import Navieq from '@/Components/NavigationEq';

import '../../css/Barber.css';
import Footer from '../Components/Footer';
import WhatsAppButton from '@/Components/Wasa';
import { Link } from '@inertiajs/react';
import SobreNosotros from '@/Components/Sobrenosotros';

export default function Jose() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navieq/>
            <section className="py-12 bg-white text-center">
                <img src="/images/jose.png" alt="Jose Ángel Sánchez Sánchez Harana" className="mx-auto mb-6 rounded-full w-60 h-60 object-cover shadow-lg" />
                <h2 className="text-4xl font-bold mb-4">José Ángel Sánchez Sánchez Harana </h2>
                <div className="flex justify-center space-x-4 mb-6">
                    <a href="https://www.instagram.com/danyvrgas" target="_blank" rel="noopener noreferrer">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" className="w-8 h-8" />
                    </a>
                    <a href="https://www.facebook.com/danyvrgas" target="_blank" rel="noopener noreferrer">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" className="w-8 h-8" />
                    </a>
                </div>

                <div className="cortes_hector" role="table" aria-label="Cortes de pelo">
            <table className="mx-auto text-center">
                <caption className="text-2xl font-bold mb-6">Mejores cortes</caption>
                <tbody>
                    <tr role="row">
                        <td role="cell">
                            <img className="tablafade" src="/images/hi.png" alt="Degradado bajo" />
                        </td>
                        <td role="cell">
                            <img className="tablafade" src="/images/tapper.jpg" alt="Degradado moderno" />
                        </td>
                        <td role="cell">
                            <img className="tablafade" src="/images/mid.jpg" alt="Peinado elegante" />
                        </td>
                        <td rowSpan="2" role="cell">
                            <img className="tablafade2" src="/images/rojo.jpg" alt="Degradado con acabado en pico" />
                        </td>
                    </tr>
                    <tr role="row">
                        <td role="cell">
                            <img className="tablafade" src="/images/alas.jpg" alt="Corte con pelo largo" />
                        </td>
                        <td role="cell">
                            <img className="tablafade" src="/images/mujer.png" alt="Estilo con pelo largo" />
                        </td>
                        <td role="cell">
                            <img className="tablafade" src="/images/ceja.png" alt="Corte clásico" />
                        </td>
                    </tr>
                </tbody>
            </table>
            <br/><br/><br/><br/>
            <Link href="/login" className="boton_lugar">
                    Reservar Cita
                </Link>
        </div>

            </section>
            <SobreNosotros/>
            <Footer />
            <WhatsAppButton />
        </div>
    );
}
