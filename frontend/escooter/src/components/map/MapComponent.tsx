'use client';
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiaGFzc2FuYWJkdWxtb3V0aSIsImEiOiJjbTR1ZG1jZTIwZXc1MmtzZ3IxcmsyMzh6In0.e-FogYMEbxQBONfgRwV6Lg';

interface MapComponentProps {
  className?: string;
  center?: [number, number];
  zoom?: number;
}

const MapComponent: React.FC<MapComponentProps> = ({
  className = '',
  center = [15.586, 56.161],
  zoom = 13
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [error, setError] = useState<string | null>(null);
  const markers = useRef<Map<string, mapboxgl.Marker>>(new Map());


  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: center,
        zoom: zoom,
      });

      map.current.addControl(new mapboxgl.NavigationControl());

      const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      });
      map.current.addControl(geolocate);


      // let activeMarkerIds = new Set();
      const fetchScooters = async () => {
        try {
          const response = await fetch('http://localhost:4000/bike/all');
          if (!response.ok) {
            throw new Error('Failed to fetch scooters');
          }
          const scooters = await response.json();
          console.log("fetch");
      
          const newScooterIds = new Set(scooters.map((scooter: any) => scooter.scooter_id));
          console.log("Total current markers: ", markers.current.size);

          markers.current.forEach((marker, markerId) => {
            if (!newScooterIds.has(markerId)) {
              marker.remove(); 
              markers.current.delete(markerId); 
            }
          });
          
          scooters.forEach((scooter: any) => {
            const markerId = scooter.scooter_id;
      
            if (!markers.current.has(markerId)) {
              const el = document.createElement('div');
              el.className = 'scooter-marker';
              el.style.backgroundImage = 'url(./scooter.png)';
              el.style.width = '32px';
              el.style.height = '32px';
              el.style.backgroundSize = 'contain';
              el.style.backgroundPosition = 'center';
              el.style.backgroundRepeat = 'no-repeat';
              el.style.cursor = 'pointer';
              el.style.borderRadius = '50%';
              el.style.boxShadow = '0 0 10px rgba(187, 255, 0, 0.2)';
      
              const marker = new mapboxgl.Marker(el)
                .setLngLat([scooter.longitude, scooter.latitude])
                .addTo(map.current!);
      
              marker.getElement().addEventListener('click', () => {
                new mapboxgl.Popup()
                  .setLngLat([scooter.longitude, scooter.latitude])
                  .setHTML(`<h3>Scooter ID: ${scooter.id}</h3><p>Battery: ${scooter.battery}%</p>`)
                  .addTo(map.current!);
              });
      
              markers.current.set(markerId, marker);
            } else {
              const marker = markers.current.get(markerId);
              marker?.setLngLat([scooter.longitude, scooter.latitude]);
            }
          });
        } catch (error) {
          console.error('Error fetching scooters:', error);
          setError('Failed to load scooters');
        }
      };
      

      fetchScooters();

      const intervalId = setInterval(fetchScooters, 1000);

      return () => clearInterval(intervalId);
    } catch (error) {
      console.error('Error initializing map:', error);
      setError('Failed to initialize map');
    }
  }, [center, zoom]);

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className={`h-full ${className}`} ref={mapContainer}></div>
  );
};

export default MapComponent;