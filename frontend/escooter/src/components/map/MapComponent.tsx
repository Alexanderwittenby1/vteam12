import React, { useEffect, useRef, useState, memo } from 'react';
import mapboxgl from 'mapbox-gl';
import { Battery, Clock, MapPin, X } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';
import karlskronaData from '../cities/karlskrona.json';

// SVG string for the charging station icon
const chargingStationSVG = `
<svg width="34px" height="34px" viewBox="0 0 15 15" version="1.1" id="charging-station" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M13,4V2.49C12.9946,2.2178,12.7723,1.9999,12.5,2c-0.2816,0.0047-0.5062,0.2367-0.5015,0.5184
	C11.9987,2.5289,11.9992,2.5395,12,2.55V5c0,0.5523,0.4477,1,1,1v5.5c0,0.2761-0.2239,0.5-0.5,0.5S12,11.7761,12,11.5v-2
	C12,8.6716,11.3284,8,10.5,8H9V2c0-0.5523-0.4477-1-1-1H2C1.4477,1,1,1.4477,1,2v11c0,0.5523,0.4477,1,1,1h6c0.5523,0,1-0.4477,1-1
	V9h1.5C10.7761,9,11,9.2239,11,9.5v2c0,0.8284,0.6716,1.5,1.5,1.5c0.8284,0,1.5-0.6716,1.5-1.5V5C14,4.4477,13.5523,4,13,4z
	 M7.2004,7.3995l-2.6006,3.4674l-0.0164-0.0072C4.5369,10.9384,4.4667,11,4.3688,11c-0.1476,0-0.2672-0.1196-0.2672-0.2672
	c0-0.028,0.0217-0.0463,0.0297-0.0717l-0.0177-0.0078l0.7766-2.3245C4.9442,8.1671,4.8238,8,4.6533,8H2.9994
	C2.7936,8,2.6762,7.7651,2.7996,7.6005l2.6006-3.4674l0.0164,0.0072C5.4631,4.0616,5.5333,4,5.6312,4
	c0.1476,0,0.2672,0.1196,0.2672,0.2672c0,0.028-0.0217,0.0463-0.0297,0.0717l0.0176,0.0078L5.1099,6.6711
	C5.0558,6.8329,5.1762,7,5.3467,7h1.6539C7.2064,7,7.3238,7.2349,7.2004,7.3995z"></path> </g></svg>
`;

const scooterMarkerSVG = `
<svg height="44px" width="44px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 390.271 390.271" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path style="fill:#56ACE0;" d="M52.816,347.927h29.802c-4.331,11.895-15.709,20.622-29.802,20.622 c-17.325,0-31.418-14.093-31.418-31.418c0-17.325,14.093-31.418,31.418-31.418c13.576,0,25.471,8.663,29.802,20.622H52.816 c-5.947,0-10.861,4.848-10.861,10.861C42.02,343.079,46.869,347.927,52.816,347.927z"></path> <path style="fill:#FFC10D;" d="M368.291,337.131c0,17.325-14.093,31.418-31.418,31.418c-17.325,0-31.418-14.093-31.418-31.418 c0-11.378,6.529-21.657,15.709-27.087l4.848,29.285c2.715,10.861,11.96,8.663,12.477,8.663c5.947-1.099,9.762-6.529,8.663-12.477 l-4.849-29.285C356.913,308.881,368.291,321.939,368.291,337.131z"></path> <g> <path style="fill:#194F82;" d="M338.489,283.992L289.681,9.244C288.582,3.814,284.251,0,278.82,0h-63.935 c-5.947,0-10.861,4.848-10.861,10.861s4.848,10.861,10.861,10.861h55.273l38.465,219.475 c-41.762,8.145-74.279,42.796-79.127,85.075h-78.545c-5.43-48.808-47.127-87.273-97.552-87.273 c-5.947,0-10.861,4.848-10.861,10.861s4.848,10.861,10.861,10.861c38.465,0,70.465,28.703,75.895,65.552h-23.855 c-4.848-23.855-26.57-42.279-52.04-42.279c-29.285,0-53.139,23.855-53.139,53.075c0,29.285,23.855,53.139,53.139,53.139 c25.471,0,47.127-18.424,52.04-42.279H240.42c7.564-0.517,10.861-7.046,10.861-12.994c1.034-35.749,27.022-66.133,61.737-72.598 l4.331,25.471c-19.523,7.564-33.616,27.087-33.616,49.325c0,29.285,23.855,53.139,53.139,53.139 c29.285,0,53.139-23.855,53.139-53.139C389.947,308.364,366.675,285.091,338.489,283.992z M52.881,368.549 c-17.325,0-31.418-14.093-31.418-31.418c0-17.325,14.093-31.418,31.418-31.418c13.576,0,25.471,8.663,29.802,20.622H52.881 c-5.947,0-10.861,4.848-10.861,10.861c0,5.947,4.848,10.861,10.861,10.861h29.802C78.352,359.887,66.909,368.549,52.881,368.549z M336.808,368.549c-17.325,0-31.418-14.093-31.418-31.418c0-11.378,6.529-21.657,15.709-27.087l4.848,29.285 c2.715,10.861,11.895,8.663,12.477,8.663c5.947-1.099,9.762-6.529,8.663-12.477l-4.849-29.285 c14.61,2.715,25.988,15.709,25.988,30.901C368.291,354.457,354.198,368.549,336.808,368.549z"></path> <path style="fill:#194F82;" d="M250.699,334.933C250.699,336.032,250.699,334.416,250.699,334.933L250.699,334.933z"></path> </g> </g></svg>
`
;

// Your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiaGFzc2FuYWJkdWxtb3V0aSIsImEiOiJjbTR1ZG1jZTIwZXc1MmtzZ3IxcmsyMzh6In0.e-FogYMEbxQBONfgRwV6Lg';

// TypeScript interfaces
interface MapComponentProps {
  className?: string;
  center?: [number, number];
  zoom?: number;
  token: string;
  onScooterSelect?: (scooter: Scooter) => void;
}

interface Scooter {
  scooter_id: number;
  latitude: string;
  longitude: string;
  battery_level: string;
  status: string;
  is_available: number;
}

interface Location {
  x: number;
  y: number;
}

interface ChargingStation {
  station_id: number;
  name: string;
  location: Location;
  capacity: number;
  created_at: string;
}

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  content: any;
  type: 'scooter' | 'station';
}

// Custom Popup Component
const CustomPopup: React.FC<PopupProps> = ({ isOpen, onClose, content, type = 'scooter' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center">
      <div 
        className={`w-full max-w-md mt-16 mx-4 transform transition-all duration-200 ease-out 
                   ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}
      >
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className={`relative p-6 ${
            type === 'scooter' 
              ? 'bg-gradient-to-r from-blue-600 to-blue-700' 
              : 'bg-gradient-to-r from-purple-600 to-pink-600'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white">
                {type === 'scooter' ? `Scooter ${content.scooter_id}` : content.name}
              </h3>
              <button
                onClick={onClose}
                className="inline-flex items-center px-3 py-1.5 bg-white/95 hover:bg-white 
                         text-gray-700 rounded-lg transition-colors duration-200"
              >
                Close
                <X className="w-4 h-4 ml-2" />
              </button>
            </div>
            <p className="text-white/80 text-sm">
              {type === 'scooter' ? 'Electric Vehicle' : 'Charging Station'}
            </p>
          </div>

          {/* Content Section */}
          <div className="p-6 space-y-4">
            {type === 'scooter' ? (
              <>
                {/* Scooter Details */}
                <div className="grid gap-4">
                  <div className="flex items-center p-4 bg-blue-50 rounded-xl">
                    <Battery className="w-6 h-6 text-blue-600 mr-4" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Battery Level</p>
                      <p className="text-lg font-semibold text-blue-700">
                        {content.battery_level}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-blue-50 rounded-xl">
                    <Clock className="w-6 h-6 text-blue-600 mr-4" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <p className={`text-lg font-semibold ${
                        content.status === 'available' ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {content.status}
                      </p>
                    </div>
                  </div>
                </div>

                {content.is_available && (
                  <button
                    onClick={() => {
                      onClose();
                      content.onSelect?.(content);
                    }}
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800
                             text-white font-medium px-6 py-3 rounded-xl
                             transition-colors duration-200
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Start Ride
                  </button>
                )}
              </>
            ) : (
              <>
                {/* Station Details */}
                <div className="grid gap-4">
                  <div className="flex items-center p-4 bg-purple-50 rounded-xl">
                    <MapPin className="w-6 h-6 text-purple-600 mr-4" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Location</p>
                      <p className="text-lg font-semibold text-purple-700">
                        {content.location.y.toFixed(4)}, {content.location.x.toFixed(4)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-purple-50 rounded-xl">
                    <div className="w-6 h-6 text-purple-600 mr-4">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" 
                          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Capacity</p>
                      <p className="text-lg font-semibold text-purple-700">
                        {content.capacity} spots
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-[2px] -z-10 transition-opacity duration-200
                   ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
    </div>
  );
};

// Main Map Component
const MapComponent = memo(({
  className = '',
  center = [15.5869, 56.1612],
  zoom = 13,
  token,
  onScooterSelect 
}: MapComponentProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [error, setError] = useState<string | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const stationMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const intervalRef = useRef<NodeJS.Timeout>();
  
  const [selectedScooter, setSelectedScooter] = useState<Scooter | null>(null);
  const [selectedStation, setSelectedStation] = useState<ChargingStation | null>(null);

  const handleScooterClick = (scooter: Scooter) => {
    setSelectedStation(null); // Close station popup if open
    setSelectedScooter(scooter);
  };

  const handleStationClick = (station: ChargingStation) => {
    setSelectedScooter(null); // Close scooter popup if open
    setSelectedStation(station);
  };

  const fetchChargingStations = async () => {
    try {
      const stations = karlskronaData.features
        .filter(feature => feature.properties.role === 'station')
        .map(feature => ({
          station_id: feature.id,
          location: {
            x: feature.geometry.coordinates[0][0][0],
            y: feature.geometry.coordinates[0][0][1]
          },
          name: `Charging Station ${feature.id}`,
          capacity: 10,
          created_at: new Date().toISOString()
        }));

      stationMarkersRef.current.forEach(marker => marker.remove());
      stationMarkersRef.current = [];

      stations.forEach((station) => {
        if (map.current) {
          const lng = station.location.x;
          const lat = station.location.y;
          
          if (!isNaN(lng) && !isNaN(lat)) {
            const el = document.createElement('div');
            el.className = 'charging-station-marker cursor-pointer transition-transform duration-200 hover:scale-110';
            el.innerHTML = chargingStationSVG;
            
            const marker = new mapboxgl.Marker({
              element: el,
              anchor: 'bottom'
            })
              .setLngLat([lng, lat])
              .addTo(map.current);

            el.addEventListener('click', () => handleStationClick(station));
            stationMarkersRef.current.push(marker);
          }
        }
      });
    } catch (err) {
      console.error('Error fetching charging stations:', err);
      setError('Failed to fetch charging stations');
    }
  };

  const fetchScooterLocations = async () => {
    try {
      const response = await fetch('http://localhost:4000/bike/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) throw new Error('Failed to fetch scooter locations');
  
      const scooters: Scooter[] = await response.json();
      
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
  
      scooters.forEach((scooter) => {
        if (map.current) {
          const lng = parseFloat(scooter.longitude);
          const lat = parseFloat(scooter.latitude);
          
          if (!isNaN(lng) && !isNaN(lat)) {
            const el = document.createElement('div');
            el.className = 'scooter-marker cursor-pointer transition-transform duration-200 hover:scale-110';
            el.innerHTML = scooterMarkerSVG;
            
            // Set color based on availability
            el.style.color = scooter.is_available ? '#4CAF50' : '#FF5252';
            el.style.width = '32px';
            el.style.height = '32px';
            
            const marker = new mapboxgl.Marker({
              element: el,
              anchor: 'center'
            })
              .setLngLat([lng, lat])
              .addTo(map.current);
  
            el.addEventListener('click', () => handleScooterClick(scooter));
            markersRef.current.push(marker);
          }
        }
      });
    } catch (err) {
      console.error('Error fetching scooter locations:', err);
      setError('Failed to fetch scooter locations');
    }
  };

  useEffect(() => {
    if (!mapContainer.current || !mapboxgl.accessToken) {
      setError('Mapbox access token is required');
      return;
    }

    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: center,
        zoom: zoom,
      });

      const nav = new mapboxgl.NavigationControl();
      map.current.addControl(nav, 'top-right');

      const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      });
      map.current.addControl(geolocate);

      map.current.on('load', () => {
        geolocate.trigger();
        fetchScooterLocations();
        fetchChargingStations();
        
        intervalRef.current = setInterval(() => {
          fetchScooterLocations();
          fetchChargingStations();
        }, 60000);
      });
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [center, zoom, token]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-600 font-medium p-4 bg-red-50 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <div 
        ref={mapContainer} 
        className={`relative w-full h-full ${className}`}
      />
      <CustomPopup
        isOpen={!!selectedScooter}
        onClose={() => setSelectedScooter(null)}
        content={{
          ...selectedScooter,
          onSelect: onScooterSelect
        }}
        type="scooter"
      />
      <CustomPopup
        isOpen={!!selectedStation}
        onClose={() => setSelectedStation(null)}
        content={selectedStation}
        type="station"
      />

      {/* Loading indicator */}
      <div className={`fixed bottom-4 right-4 transition-opacity duration-200 
                      ${markersRef.current.length === 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="bg-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm text-gray-600">Loading locations...</span>
        </div>
      </div>
    </>
  );
});

// Add display name for debugging
MapComponent.displayName = 'MapComponent';

// Add CSS for marker animations
const style = document.createElement('style');
style.textContent = `
  .scooter-marker {
    transform-origin: bottom;
    transition: transform 0.2s ease-out;
  }
  
  .scooter-marker:hover {
    transform: scale(1.2);
  }
  
  .charging-station-marker {
    transform-origin: bottom;
    transition: transform 0.2s ease-out;
  }
  
  .charging-station-marker:hover {
    transform: scale(1.2);
  }

  .mapboxgl-popup {
    z-index: 1;
  }
`;
document.head.appendChild(style);

export default MapComponent;