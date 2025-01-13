import React from 'react';
import '../../css/Barber.css'; 

export default function Localizacion() {
    return (
        <div className="maps-fullscreen">
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3195.680858430539!2d-6.355628223620823!3d36.77822286893713!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd0dde25e00df87f%3A0x64250864e1514f9e!2sPeluquer%C3%ADa%20Barber%2034!5e0!3m2!1ses!2ses!4v1701301140947!5m2!1ses!2ses"
                width="100%"
                height="100%"
                style={{ border: '0' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
        </div>
    );
}
