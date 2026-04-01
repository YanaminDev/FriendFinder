import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Button from '../../components/Button';

export interface SelectedLocation {
  lat: number;
  lng: number;
}

interface LocationPickerProps {
  onAddLocationClick?: (coords: SelectedLocation) => void;
  onMapReady?: (map: mapboxgl.Map) => void;
  initialCenter?: [number, number];
  initialZoom?: number;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  onAddLocationClick,
  onMapReady,
  initialCenter = [100.5018, 13.7563],
  initialZoom = 12,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const coordsRef = useRef<SelectedLocation>({
    lat: initialCenter[1],
    lng: initialCenter[0],
  });
  const [displayCoords, setDisplayCoords] = useState<SelectedLocation>({
    lat: initialCenter[1],
    lng: initialCenter[0],
  });
  const lastUpdateRef = useRef(0);
  const THROTTLE_MS = 500; // Update display every 500ms

  // Initialize map
  useEffect(() => {
    const token = import.meta.env.VITE_MAPBOX_TOKEN;
    if (token) {
      mapboxgl.accessToken = token;
    }

    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: initialCenter,
      zoom: initialZoom,
      dragRotate: false,
      touchZoomRotate: false,
    });

    // Update coordinates when map moves
    const handleMapMove = () => {
      if (map.current) {
        const center = map.current.getCenter();
        const newCoords = {
          lat: parseFloat(center.lat.toFixed(6)),
          lng: parseFloat(center.lng.toFixed(6)),
        };
        
        // Update ref immediately (no re-render)
        coordsRef.current = newCoords;
        
        // Update display state with throttle
        const now = Date.now();
        if (now - lastUpdateRef.current >= THROTTLE_MS) {
          setDisplayCoords(newCoords);
          lastUpdateRef.current = now;
        }
      }
    };

    map.current.on('move', handleMapMove);
    map.current.on('load', handleMapMove);

    // Notify parent when map is ready
    if (onMapReady) {
      map.current.on('load', () => {
        if (map.current) {
          onMapReady(map.current);
        }
      });
    }

    return () => {
      if (map.current) {
        map.current.off('move', handleMapMove);
        map.current.off('load', handleMapMove);
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  const handleAddLocation = () => {
    if (onAddLocationClick) {
      onAddLocationClick(coordsRef.current);
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Fixed Crosshair at Center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
        <svg width="60" height="60" viewBox="0 0 60 60" className="text-red-500">
          {/* Horizontal line */}
          <line x1="10" y1="30" x2="50" y2="30" stroke="currentColor" strokeWidth="2" />
          {/* Vertical line */}
          <line x1="30" y1="10" x2="30" y2="50" stroke="currentColor" strokeWidth="2" />
          {/* Center circle */}
          <circle cx="30" cy="30" r="4" fill="currentColor" />
        </svg>
      </div>

      {/* Coordinates Display */}
      <div className="absolute top-6 left-6 bg-white bg-opacity-90 px-4 py-3 rounded-lg shadow-lg z-20 font-mono text-sm">
        <div className="font-semibold text-gray-800 mb-2">Selected Location</div>
        <div className="text-gray-700">
          <div>Lat: <span className="font-bold">{displayCoords.lat}</span></div>
          <div>Lng: <span className="font-bold">{displayCoords.lng}</span></div>
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

      {/* Info Text */}
      <div className="absolute bottom-40 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded text-sm z-20">
        Move the map to select a location
      </div>
    </div>
  );
};

export default LocationPicker;

