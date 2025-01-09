import React, { useState, useEffect } from "react";
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
    const carrito = Array.isArray(props.carrito) ? props.carrito : [];

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

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://www.paypal.com/sdk/js?client-id=ATtT5kxLGNQytT2BLx-v6UI52wA3PFMCF2ct7kG-4R4-4XmlDUIGWfgKKLJfxEpDFKHz_bd3YhEAKFK2&currency=EUR";
        script.async = true;
        document.body.appendChild(script);
        return () => document.body.removeChild(script);
    }, []);

    // Dirección fija para recogida en tienda
    const direccionRecogida = "Peluquería Barber's 18, C. Cristóbal Colón, 20, 11540 Sanlúcar de Barrameda, Cádiz";

    // Manejar cambios en el formulario de dirección
    const handleDireccionChange = (e) => {
        setDireccion({ ...direccion, [e.target.name]: e.target.value });
    };

    // Concatenar los datos de dirección antes de enviarlos
    const direccionCompleta = `${direccion.nombre}, ${direccion.calle}, ${direccion.ciudad}, CP: ${direccion.codigo_postal}, ${direccion.pais}, Tel: ${direccion.telefono}`;

    // Calcular el total del pedido
    const totalPedido = carrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);

    // Manejar el cambio del método de entrega y saltar de paso si es recogida
    const handleMetodoEntrega = (metodo) => {
        setMetodoEntrega(metodo);
        if (metodo === "recogida") {
            setStep(3);
        } else {
            setStep(2);
        }
    };


    // Validaciones para el paso de dirección
    const handleNextStep = () => {
        if (metodoEntrega === "envio" && Object.values(direccion).some(value => value.trim() === "")) {
            Swal.fire("Error", "Complete todos los campos de dirección.", "error");
            return;
        }
        setStep(3);
    };

    // Enviar el pedido a la API
    const handleConfirmOrder = () => {
        Swal.fire({
            title: "Pago del Pedido",
            html: `<div id="paypal-button-container"></div>`,
            showConfirmButton: false,
            willOpen: () => {
                // Renderizar el botón de PayPal
                window.paypal.Buttons({
                    createOrder: function (data, actions) {
                        return actions.order.create({
                            purchase_units: [{
                                amount: { value: totalPedido.toFixed(2) }, // Total del pedido
                            }]
                        });
                    },
                    onApprove: function (data, actions) {
                        return actions.order.capture().then(function (details) {
                            // Confirmar el pedido en la API después del pago
                            axios.post("/api/tramitar-pedido", {
                                metodo_entrega: metodoEntrega,
                                direccion: metodoEntrega === "envio" ? direccionCompleta : direccionRecogida,
                                productos: carrito,
                            })
                            .then((response) => {
                                const pedidoId = response.data.pedido_id;
                                Swal.fire({
                                    title: "¡Pedido Realizado!",
                                    html: `
                                        <p><strong>ID del Pedido:</strong> #${pedidoId}</p>
                                        <p>Gracias por su compra. Revisa tu correo electrónico para más detalles.</p>
                                    `,
                                    icon: "success",
                                    confirmButtonText: "Aceptar",
                                }).then(() => {
                                    // Limpiar carrito y redirigir
                                    localStorage.removeItem("carrito");
                                    window.location.href = "/pedido-confirmado";
                                });
                            });
                        });
                    },
                    onCancel: function () {
                        Swal.fire("Pago Cancelado", "Tu pedido no se ha completado.", "info");
                    },
                    onError: function (err) {
                        console.error("Error en el pago de PayPal:", err);
                        Swal.fire("Error", "Hubo un problema con el pago. Inténtalo de nuevo.", "error");
                    },
                }).render("#paypal-button-container");
            }
        });
    };





    return (
        <div className="min-h-screen bg-gray-100">
            <NavigationCliente />

            <div className="max-w-3xl mx-auto p-6 mt-10 bg-white shadow-md rounded-lg">
                {/* Paso 1: Selección del método de entrega */}
                {step === 1 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-center">Selecciona el método de entrega</h2>
                        <button
                            className={`w-full p-3 my-2 rounded-lg ${metodoEntrega === "recogida" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
                            onClick={() => handleMetodoEntrega("recogida")}
                        >
                            Recogida en tienda
                        </button>
                        <button
                            className={`w-full p-3 my-2 rounded-lg ${metodoEntrega === "envio" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
                            onClick={() => handleMetodoEntrega("envio")}
                        >
                            Envío a domicilio
                        </button>

                        <button
                className="w-full bg-gray-500 text-white p-3 mt-4 rounded-lg hover:bg-gray-600"
                onClick={() => window.location.href = "/barbershop"}
            >
                Volver a la tienda
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
                        <button className="w-full bg-gray-400 text-white p-3 mt-2 rounded-lg" onClick={() => setStep(1)}>
    Volver
</button>

                    </div>
                )}

                {/* Paso 3: Confirmación del pedido */}
                {step === 3 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-center">Confirmación del pedido</h2>
                        <p><strong>Método de entrega:</strong> {metodoEntrega === "recogida" ? "Recogida en tienda" : "Envío a domicilio"}</p>
                        <div className="flex justify-between items-center">
    <p><strong>Dirección:</strong> {metodoEntrega === "recogida" ? direccionRecogida : direccionCompleta}</p>
    {metodoEntrega === "envio" && (
        <button
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            onClick={() => setStep(2)}
        >
            Editar
        </button>
    )}
</div>


                        {/* Vista previa del pedido */}
                        <h3 className="text-xl font-bold mt-4 mb-2">Vista previa del pedido:</h3>
                        <div>
                            {carrito.map((producto) => (
                                <div key={producto.id} className="flex justify-between border-b py-2">
                                    <div className="flex items-center">
                                        <img src={`/storage/${producto.imagen}`} alt={producto.nombre} className="w-12 h-12 object-cover rounded mr-4" />
                                        <p className="font-semibold">{producto.nombre}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-700">Cantidad: {producto.cantidad}</p>
                                        <p className="text-gray-900 font-bold">{(producto.precio * producto.cantidad).toFixed(2)} €</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Total del pedido */}
                        <h3 className="text-xl font-bold mt-4 text-center">Total: {totalPedido.toFixed(2)} €</h3>

                        <button className="w-full bg-blue-600 text-white p-3 mt-4 rounded-lg" onClick={handleConfirmOrder}>
                            Confirmar Pedido
                        </button>
                        <button className="w-full bg-gray-400 text-white p-3 mt-2 rounded-lg" onClick={() => setStep(1)}>
    Volver
</button>

                    </div>
                )}
            </div>

            <Localizacion />
            <SobreNosotros />
            <Footer />
            <WhatsAppButton />
        </div>
    );
}
