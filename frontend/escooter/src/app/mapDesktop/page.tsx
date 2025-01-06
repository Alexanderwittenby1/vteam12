'use client';
import dynamic from 'next/dynamic';



const MapComponent = dynamic(
  () => import('@/components/map/MapComponent'),
  { ssr: false }
);

export default function mapDesktop() {

  
    return (
        <div className="h-screen w-full">
            <MapComponent className="h-full" />
        </div>
      
    );
  

  

 
}