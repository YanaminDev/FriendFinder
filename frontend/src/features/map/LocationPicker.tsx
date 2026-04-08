import React, { useCallback, useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Button from '../../components/Button';

export interface SelectedLocation {
  latitude: number;
  longitude: number;
}

export interface Location {
  id: string;
  name: string;
  description?: string;
  phone?: string;
  activity_id?: string;
  open_date?: string;
  open_time?: string;
  close_time?: string;
  latitude: number;
  longitude: number;
}

interface LocationPickerProps {
  onAddLocationClick?: (coords: SelectedLocation) => void;
  initialCenter?: [number, number];
  initialZoom?: number;
  locations?: Location[];
  onLocationClick?: (location: Location) => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  onAddLocationClick,
  initialCenter = [100.5018, 13.7563],
  initialZoom = 12,
  locations = [],
  onLocationClick,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const coordsRef = useRef<SelectedLocation>({
    latitude: initialCenter[1],
    longitude: initialCenter[0],
  });
  const [displayCoords, setDisplayCoords] = useState<SelectedLocation>({
    latitude: initialCenter[1],
    longitude: initialCenter[0],
  });
  const lastUpdateRef = useRef(0);
  const THROTTLE_MS = 500;

  // Initialize map — runs once only
  useEffect(() => {
    const token = import.meta.env.VITE_MAPBOX_TOKEN;
    if (token) {
      mapboxgl.accessToken = token;
    }

    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: initialCenter,
      zoom: initialZoom,
      dragRotate: false,
      touchZoomRotate: false,
    });

    const handleMapMove = () => {
      if (!map.current) return;
      const center = map.current.getCenter();
      const newCoords = {
        latitude: parseFloat(center.lat.toFixed(6)),
        longitude: parseFloat(center.lng.toFixed(6)),
      };
      coordsRef.current = newCoords;
      const now = Date.now();
      if (now - lastUpdateRef.current >= THROTTLE_MS) {
        setDisplayCoords(newCoords);
        lastUpdateRef.current = now;
      }
    };

    map.current.on('move', handleMapMove);
    map.current.on('load', () => {
      handleMapMove();
      setMapLoaded(true);
    });

    return () => {
      setMapLoaded(false);
      if (map.current) {
        map.current.off('move', handleMapMove);
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Sync markers — runs after map loads and whenever locations change
  const onLocationClickStable = useCallback(
    (location: Location) => onLocationClick?.(location),
    [onLocationClick]
  );

  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    // Remove all previous markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    locations.forEach(location => {
      const el = document.createElement('div');
      el.style.width = '40px';
      el.style.height = '40px';
      el.style.backgroundColor = '#FF4840';
      el.style.borderRadius = '50%';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
      el.style.cursor = 'pointer';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.fontSize = '18px';
      el.textContent = '📍';

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="font-weight:bold;margin-bottom:4px">${location.name}</div>
        ${location.description ? `<div style="font-size:12px;color:#666;margin-bottom:4px">${location.description}</div>` : ''}
        ${location.phone ? `<div style="font-size:12px">📞 ${location.phone}</div>` : ''}
        <div style="font-size:11px;color:#999;margin-top:4px">
          Lat: ${location.latitude.toFixed(4)}<br/>Lng: ${location.longitude.toFixed(4)}
        </div>
      `);

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([location.longitude, location.latitude])
        .setPopup(popup)
        .addTo(map.current!);

      el.addEventListener('click', () => onLocationClickStable(location));
      markersRef.current.push(marker);
    });
  }, [mapLoaded, locations, onLocationClickStable]);

  const handleAddLocation = () => {
    onAddLocationClick?.(coordsRef.current);
  };

  return (
    <div className="relative w-full h-full">
      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Fixed Crosshair at Center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
        {/* Pulse ring */}
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-red-500 opacity-30 animate-ping" />
        <svg width="60" height="60" viewBox="0 0 60 60" className="text-red-500 relative">
          {/* Horizontal line */}
          <line x1="5" y1="30" x2="25" y2="30" stroke="currentColor" strokeWidth="2" />
          <line x1="35" y1="30" x2="55" y2="30" stroke="currentColor" strokeWidth="2" />
          {/* Vertical line */}
          <line x1="30" y1="5" x2="30" y2="25" stroke="currentColor" strokeWidth="2" />
          <line x1="30" y1="35" x2="30" y2="55" stroke="currentColor" strokeWidth="2" />
          {/* Center red dot */}
          <circle cx="30" cy="30" r="8" fill="#EF4444" stroke="white" strokeWidth="2" />
        </svg>
      </div>

      {/* Coordinates Display */}
      <div className="absolute top-6 left-6 bg-white bg-opacity-90 px-4 py-3 rounded-lg shadow-lg z-20 font-mono text-sm">
        <div className="font-semibold text-gray-800 mb-2">Selected Location</div>
        <div className="text-gray-700">
          <div>Lat: <span className="font-bold">{displayCoords.latitude}</span></div>
          <div>Lng: <span className="font-bold">{displayCoords.longitude}</span></div>
        </div>
      </div>

      {/* Add Location Button */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20">
        <Button
          variant="primary"
          size="md"
          onClick={handleAddLocation}
        >
          ADD LOCATION
        </Button>
      </div>

      
    </div>
  );
};

export default LocationPicker;

