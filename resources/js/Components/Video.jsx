import React from 'react';
import '../../css/Barber.css'; 

export default function VideoBarber() {
    return (
        <section className="cabildo">
            <div>
                <video
                    className="local"
                    src="/videos/local.mp4"
                    preload="metadata"
                    controls
                    title="Nuestra barbería"
                ></video>
            </div>
        </section>
    );
}
