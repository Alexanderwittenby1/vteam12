'use client';
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set access token
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
  const markers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    // Check if we're in browser and container exists
    if (!mapContainer.current) return;

    try {
      // Create map instance
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: center,
        zoom: zoom,
      });

      // Add navigation control
      map.current.addControl(new mapboxgl.NavigationControl());

      // Add geolocate control
      const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      });
      map.current.addControl(geolocate);

      // Function to fetch scooter data from API
      const fetchScooters = async () => {
        try {
          const response = await fetch('http://localhost:4000/bike/all');
          if (!response.ok) {
            throw new Error('Failed to fetch scooters');
          }
          const scooters = await response.json();

          // Remove existing markers
          markers.current.forEach(marker => marker.remove());
          markers.current = [];

          // Add markers for each scooter
          scooters.forEach((scooter: any) => {
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
            el.style.boxShadow = '0 0 10px rgba(255, 0, 0, 0.2)';

            const marker = new mapboxgl.Marker(el)
              .setLngLat([scooter.longitude, scooter.latitude])
              .addTo(map.current!);

            // Add click event listener to marker
            marker.getElement().addEventListener('click', () => {
              new mapboxgl.Popup()
                .setLngLat([scooter.longitude, scooter.latitude])
                .setHTML(`<h3>Scooter ID: ${scooter.id}</h3><p>Battery: ${scooter.battery}%</p>`)
                .addTo(map.current!);
            });

            markers.current.push(marker);
          });
        } catch (error) {
          console.error('Error fetching scooters:', error);
          setError('Failed to load scooters');
        }
      };

      // Fetch scooters initially
      fetchScooters();

      // Set interval to fetch scooters every 10 seconds
      const intervalId = setInterval(fetchScooters, 10000);

      // Cleanup interval on component unmount
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