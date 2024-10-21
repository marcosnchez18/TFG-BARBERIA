import React from 'react';
import { Link } from '@inertiajs/react';
import '../../css/Barber.css';

export default function Header() {
    return (
        <header id="home" className="header-container" style={{ backgroundImage: "url('/images/fondo.png')" }}>
            <div className="header-overlay">
                <h1 className="rozha_titulo">ESTILO, TÉCNICA <br />E <br />INNOVACIÓN</h1>
                <Link href="/login" className="header-button"><br />
                    Reservar Cita
                </Link>

                {/* Añadir el rectángulo de horario debajo del botón */}
                <div className="horario-rectangulo">
                    <p className="blanco">Ancha 43. Sanlúcar, (Cádiz)</p>
                    <br />
                    <p className="naranja">Lun - Jue &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Viernes</p>
                    <br />
                    <p className="negro">09:00 - 19:30 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 09:00 - 18:00</p>
                    <br />
                    <p className="barber">BARBER’S 18</p>
                </div>
            </div>
        </header>
    );
}
