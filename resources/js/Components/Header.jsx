import React from 'react';
import { Link } from '@inertiajs/react';
import '../../css/Barber.css';

export default function Header() {
    return (
        <header
            id="home"
            className="header-container"
            style={{ backgroundImage: "url('/images/fondo.png')" }}
            itemScope
            itemType="https://schema.org/LocalBusiness"
        >
            <meta itemProp="name" content="Barber's18" />
            <meta itemProp="description" content="Barbería de referencia en Sanlúcar de Barrameda. Ofrecemos cortes de cabello, afeitado y cuidado de la barba con los mejores profesionales." />
            <meta itemProp="address" content="C/ Cristobal Colón, 20, Sanlúcar de Bda, Cádiz, España" />
            <meta itemProp="telephone" content="+34 622541527" />
            <meta itemProp="priceRange" content="€€" />
            <meta itemProp="openingHours" content="Mo-Th 09:00-19:30, Fr 09:00-18:00" />

            <div className="header-overlay">
                <h1 className="rozha_titulo">ESTILO, TÉCNICA <br />E <br />INNOVACIÓN</h1>
                <Link href="/login" className="boton_lugar" itemProp="potentialAction" itemScope itemType="https://schema.org/ReserveAction">
                    <span itemProp="name">Reservar Cita</span>
                </Link>

                <div className="horario-rectangulo" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                    <p className="blanco">
                        <span itemProp="streetAddress">C/ Cristobal Colón, 20</span>,
                        <span itemProp="addressLocality"> Sanlúcar de Bda</span>
                        (<span itemProp="addressRegion">Cádiz</span>)
                    </p>
                    <br />
                    <p className="naranja">
                        <span itemProp="openingHoursSpecification" itemScope itemType="https://schema.org/OpeningHoursSpecification">
                            <span itemProp="dayOfWeek">Lun - Vie</span>
                        </span>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <span itemProp="openingHoursSpecification" itemScope itemType="https://schema.org/OpeningHoursSpecification">
                            <span itemProp="dayOfWeek">Sábados</span>
                        </span>
                    </p>
                    <br />
                    <p className="negro">
                        <span itemProp="openingHours">10:00 - 20:00</span>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <span itemProp="openingHours">10:00 - 14:00</span>
                    </p>
                    <br />
                    <p className="barber" itemProp="name">BARBER’S 18</p>
                </div>
            </div>
        </header>
    );
}
