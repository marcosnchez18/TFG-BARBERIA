import React from 'react';
import NavigationResto from '../Components/NavigationResto';
import WhatsAppButton from '@/Components/Wasa'; 
import SobreNosotros from '@/Components/Sobrenosotros';
import Footer from '../Components/Footer';
import NuestraHistoria from '@/Components/Historia';
import VideoBarber from '@/Components/Video';

export default function Welcome() {
    return (
        <div>
            <NavigationResto />
            <NuestraHistoria/>
            <VideoBarber/>
            <SobreNosotros />
            <Footer />
            <WhatsAppButton />
        </div>
    );
}
