import React, { useState } from 'react';

export default function Acordeon({ items }) {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-12 bg-gray-200">
            <h2 className="text-3xl font-bold text-center mb-8" style={{ fontFamily: 'Times New Roman, serif' }}>
                Preguntas Frecuentes
            </h2>
            <div className="max-w-4xl mx-auto">
                {items.map((item, index) => (
                    <div key={index} className="mb-4">
                        <button
                            className="w-full text-left bg-white py-4 px-6 rounded shadow-md focus:outline-none"
                            onClick={() => toggleFAQ(index)}
                        >
                            <h3 className="text-xl font-semibold">{item.question}</h3>
                        </button>
                        {openIndex === index && (
                            <div className="bg-white px-6 py-4 text-gray-700 border-t">
                                <p>{item.answer}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
