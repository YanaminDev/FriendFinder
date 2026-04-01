import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

export interface Location {
  id: string;
  name: string;
  description?: string;
  phone?: string;
  activityId?: string;
  openDate?: string;
  openTime?: string;
  closeTime?: string;
  lat: number;
  lng: number;
}

interface LocationMarkersProps {
  map: React.MutableRefObject<mapboxgl.Map | null>;
  locations: Location[];
  onLocationClick?: (location: Location) => void;
}

const LocationMarkers: React.FC<LocationMarkersProps> = ({ map, locations, onLocationClick }) => {
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    console.log('🔍 LocationMarkers: map.current =', map.current ? '✅ Ready' : '❌ Not ready');
    console.log('🔍 LocationMarkers: locations =', locations);
    
    if (!map.current) {
      console.log('⚠️ Map not ready yet, waiting...');
      return;
    }

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    locations.forEach(location => {
      console.log('✅ Creating marker for:', location.name, `[${location.lat}, ${location.lng}]`);
      
      // Create marker element - red circle
      const markerElement = document.createElement('div');
      markerElement.style.width = '40px';
      markerElement.style.height = '40px';
      markerElement.style.backgroundColor = '#FF4840';
      markerElement.style.borderRadius = '50%';
      markerElement.style.border = '3px solid white';
      markerElement.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';
      markerElement.style.cursor = 'pointer';
      markerElement.style.display = 'flex';
      markerElement.style.alignItems = 'center';
      markerElement.style.justifyContent = 'center';
      markerElement.style.fontSize = '18px';
      markerElement.style.fontWeight = 'bold';
      markerElement.style.color = 'white';
      markerElement.textContent = '📍';

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="font-weight: bold; margin-bottom: 4px;">${location.name}</div>
        ${location.description ? `<div style="font-size: 12px; color: #666; margin-bottom: 4px;">${location.description}</div>` : ''}
        ${location.phone ? `<div style="font-size: 12px;">📞 ${location.phone}</div>` : ''}
        <div style="font-size: 11px; color: #999; margin-top: 4px;">
          Lat: ${location.lat.toFixed(4)}<br/>
          Lng: ${location.lng.toFixed(4)}
        </div>
      `);

      // Create marker
      const marker = new mapboxgl.Marker({ element: markerElement })
        .setLngLat([location.lng, location.lat])
        .setPopup(popup)
        .addTo(map.current!);

      // Add click handler
      markerElement.addEventListener('click', () => {
        if (onLocationClick) {
          onLocationClick(location);
        }
      });

      markersRef.current.push(marker);
      console.log('✅ Marker added, total markers:', markersRef.current.length);
    });
  }, [locations, onLocationClick]);

  return null; // Component doesn't render anything, only manages markers
};

export default LocationMarkers;
