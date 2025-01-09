import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Footer from "../Components/Footer";
import Localizacion from "../Components/Localizacion";
import SobreNosotros from "../Components/Sobrenosotros";
import "../../css/Barber.css";
import NavigationCliente from "@/Components/NavigationCliente";
import WhatsAppButton from "@/Components/Wasa";
import { usePage } from "@inertiajs/react";

export default function TramitarPedido() {

    const { props } = usePage();
    const carrito = props.carrito || [];


    const [step, setStep] = useState(1);
    const [metodoEntrega, setMetodoEntrega] = useState('');
    const [direccion, setDireccion] = useState({
        nombre: '',
        calle: '',
        ciudad: '',
        codigo_postal: '',
        pais: '',
        telefono: '',
    });

    // Manejar cambios en el formulario de dirección
    const handleDireccionChange = (e) => {
        setDireccion({ ...direccion, [e.target.name]: e.target.value });
    };

    // Unir los datos de la dirección en una sola cadena antes de enviarlos
    const direccionCompleta = `${direccion.nombre}, ${direccion.calle}, ${direccion.ciudad}, CP: ${direccion.codigo_postal}, ${direccion.pais}, Tel: ${direccion.telefono}`;

    // Validaciones para los pasos
    const handleNextStep = () => {
        if (step === 1 && metodoEntrega === '') {
            Swal.fire("Error", "Seleccione un método de entrega.", "error");
            return;
        }
        if (step === 2 && metodoEntrega === "envio" && Object.values(direccion).some(value => value.trim() === "")) {
            Swal.fire("Error", "Complete todos los campos de dirección.", "error");
            return;
        }
        setStep(step + 1);
    };

    // Enviar el pedido a la API
    const handleConfirmOrder = () => {
        axios.post("/api/tramitar-pedido", {
            metodo_entrega: metodoEntrega,
            direccion: metodoEntrega === "envio" ? direccionCompleta : null,
            productos: carrito
        })
        .then(() => {
            Swal.fire("Pedido realizado", "Tu pedido ha sido registrado con éxito.", "success")
                .then(() => window.location.href = "/"); // Redirige a la página principal después de confirmar
        })
        .catch(() => {
            Swal.fire("Error", "Hubo un problema al realizar el pedido.", "error");
        });
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <NavigationCliente />

            <div className="max-w-lg mx-auto p-6 mt-10 bg-white shadow-md rounded-lg">
                {/* Paso 1: Selección del método de entrega */}
                {step === 1 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-center">Selecciona el método de entrega</h2>
                        <button
                            className={`w-full p-3 my-2 rounded-lg ${metodoEntrega === "recogida" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
                            onClick={() => setMetodoEntrega("recogida")}
                        >
                            Recogida en tienda
                        </button>
                        <button
                            className={`w-full p-3 my-2 rounded-lg ${metodoEntrega === "envio" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
                            onClick={() => setMetodoEntrega("envio")}
                        >
                            Envío a domicilio
                        </button>
                        <button className="w-full bg-green-500 text-white p-3 mt-4 rounded-lg" onClick={handleNextStep}>
                            Siguiente
                        </button>
                    </div>
                )}

                {/* Paso 2: Formulario de Dirección (solo si seleccionó "envio") */}
                {step === 2 && metodoEntrega === "envio" && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-center">Ingrese su dirección de envío</h2>
                        <form className="space-y-3">
                            <input type="text" name="nombre" placeholder="Nombre completo" className="w-full p-2 border rounded" value={direccion.nombre} onChange={handleDireccionChange} />
                            <input type="text" name="calle" placeholder="Calle y número" className="w-full p-2 border rounded" value={direccion.calle} onChange={handleDireccionChange} />
                            <input type="text" name="ciudad" placeholder="Ciudad" className="w-full p-2 border rounded" value={direccion.ciudad} onChange={handleDireccionChange} />
                            <input type="text" name="codigo_postal" placeholder="Código Postal" className="w-full p-2 border rounded" value={direccion.codigo_postal} onChange={handleDireccionChange} />
                            <input type="text" name="pais" placeholder="País" className="w-full p-2 border rounded" value={direccion.pais} onChange={handleDireccionChange} />
                            <input type="text" name="telefono" placeholder="Teléfono de contacto" className="w-full p-2 border rounded" value={direccion.telefono} onChange={handleDireccionChange} />
                        </form>
                        <button className="w-full bg-green-500 text-white p-3 mt-4 rounded-lg" onClick={handleNextStep}>
                            Siguiente
                        </button>
                    </div>
                )}

                {/* Paso 3: Confirmación del pedido */}
                {step === 3 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-center">Confirmación del pedido</h2>
                        <p><strong>Método de entrega:</strong> {metodoEntrega === "recogida" ? "Recogida en tienda" : "Envío a domicilio"}</p>
                        {metodoEntrega === "envio" && <p><strong>Dirección:</strong> {direccionCompleta}</p>}

                        {/* Vista previa del pedido */}
                        <h3 className="text-xl font-bold mt-4 mb-2">Vista previa del pedido:</h3>
                        <div className="max-h-60 overflow-y-auto">
                        {Array.isArray(carrito) && carrito.length > 0 ? (
    carrito.map((producto) => (
        <div key={producto.id} className="flex items-center border-b py-2">
            <img src={`/storage/${producto.imagen}`} alt={producto.nombre} className="w-12 h-12 object-cover rounded mr-4" />
            <div>
                <p className="font-semibold">{producto.nombre}</p>
                <p className="text-gray-700">Cantidad: {producto.cantidad}</p>
            </div>
        </div>
    ))
) : (
    <p className="text-gray-600 text-center">No hay productos en el pedido.</p>
)}

                        </div>

                        <button className="w-full bg-blue-600 text-white p-3 mt-4 rounded-lg" onClick={handleConfirmOrder}>
                            Confirmar Pedido
                        </button>
                    </div>
                )}
            </div>

            {/* Componentes adicionales */}
            <Localizacion />
            <SobreNosotros />
            <Footer />
            <WhatsAppButton />
        </div>
    );
}
