// MapView.tsx
// ย้ายโค้ดจาก components/Map.tsx มาที่นี่
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export interface LocationData {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  lat: number;
  lng: number;
  tags?: string[];
}

interface MapProps {
  className?: string;
  onLocationClick?: (location: LocationData) => void;
}

const MapView: React.FC<MapProps> = ({ className = '', onLocationClick }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [tokenLoaded, setTokenLoaded] = useState(false);
  const [mousePos, setMousePos] = useState<{ lat: number; lng: number; x: number; y: number } | null>(null);

  useEffect(() => {
    // Try to get token from frontend env first, fallback to backend
    const token = import.meta.env.VITE_MAPBOX_TOKEN;
    if (token) {
      mapboxgl.accessToken = token;
      setTokenLoaded(true);
    } else {
      // Fallback to backend if no frontend token
      fetch('http://localhost:3000/v1/map/token')
        .then(res => res.json())
        .then(data => {
          mapboxgl.accessToken = data.token;
          setTokenLoaded(true);
        })
        .catch(err => {
          console.error('Failed to load Mapbox token:', err);
        });
    }
  }, []);

  useEffect(() => {
    if (!tokenLoaded || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [100.5018, 13.7563],
      zoom: 12,
    });

    // Sample location data
    const locations: LocationData[] = [
      {
        id: '1',
        name: 'The Mall',
        address: '1790 น. พหลโยธิน แขวงจตุจักร กรุงเทพมหานคร 11000',
        phone: '0873568243',
        hours: 'open Mon-Fri 8:30 AM - 9:30 PM',
        lat: 13.6919,
        lng: 100.5581,
        tags: ['Cinema', 'Karaoke', 'Shopping']
      }
    ];

    // Add markers for each location
    locations.forEach(location => {
      const markerElement = document.createElement('div');
      markerElement.style.width = '40px';
      markerElement.style.height = '40px';
      markerElement.style.backgroundImage = 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxOCIgZmlsbD0iI0ZGNDg0MCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+")';
      markerElement.style.backgroundSize = 'contain';
      markerElement.style.backgroundRepeat = 'no-repeat';
      markerElement.style.backgroundPosition = 'center';
      markerElement.style.cursor = 'pointer';

      new mapboxgl.Marker({ element: markerElement })
        .setLngLat([location.lng, location.lat])
        .addTo(map.current!);

      // Add click handler to marker
      markerElement.addEventListener('click', () => {
        if (onLocationClick) {
          onLocationClick(location);
        }
      });
    });

    // Add mouse move listener to show coordinates
    const handleMouseMove = (e: mapboxgl.MapMouseEvent) => {
      const { lng, lat } = e.lngLat;
      setMousePos({ lat: parseFloat(lat.toFixed(4)), lng: parseFloat(lng.toFixed(4)), x: e.originalEvent.clientX, y: e.originalEvent.clientY });
    };

    const handleMouseLeave = () => {
      setMousePos(null);
    };

    map.current.on('mousemove', handleMouseMove);
    map.current.on('mouseleave', handleMouseLeave);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [tokenLoaded, onLocationClick]);

  return <div ref={mapContainer} className={`w-full h-full ${className}`}>
    {mousePos && (
      <div
        className="fixed bg-gray-900 text-white px-3 py-2 rounded shadow-lg text-sm font-mono z-50"
        style={{
          left: `${mousePos.x + 10}px`,
          top: `${mousePos.y + 10}px`,
          pointerEvents: 'none',
        }}
      >
        <div>Lat: {mousePos.lat}</div>
        <div>Lng: {mousePos.lng}</div>
      </div>
    )}
  </div>;
};

export default MapView;
