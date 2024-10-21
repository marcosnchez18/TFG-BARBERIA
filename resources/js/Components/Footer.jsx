import React from 'react';
import '../../css/Barber.css';  // Importamos Barber.css para aplicar los estilos

export default function Footer() {
    return (
        <footer>
            <div className="container mx-auto text-center">
                <p>© 2024 Barbería. Todos los derechos reservados.</p>
                <div className="mt-4 flex justify-center">
                    <a href="http://creativecommons.org/licenses/by-sa/4.0/" rel="license">
                        <img
                            className="licencia"
                            alt="Licencia Creative Commons"
                            src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png"
                        />
                    </a>
                </div>
            </div>
        </footer>
    );
}
