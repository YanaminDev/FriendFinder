
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapProps {
  className?: string;
}


const Map: React.FC<MapProps> = ({ className = '' }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [tokenLoaded, setTokenLoaded] = useState(false);

  useEffect(() => {
    // ดึง token จาก backend
    fetch('http://localhost:3000/v1/map/token')
      .then(res => res.json())
      .then(data => {
        mapboxgl.accessToken = data.token;
        setTokenLoaded(true);
      });
  }, []);

  useEffect(() => {
    if (!tokenLoaded || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [100.5018, 13.7563],
      zoom: 12,
    });

    // Add marker at The Mall
    const markerElement = document.createElement('div');
    markerElement.style.width = '30px';
    markerElement.style.height = '30px';
    markerElement.style.backgroundImage = 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cmVjdCB4PSI1IiB5PSI1IiB3aWR0aD0iMjIiIGhlaWdodD0iMjIiIGZpbGw9IiNGRjAwMDAiIHJ4PSIyIi8+PHRleHQgeD0iMTYiIHk9IjIwIiBmb250LXNpemU9IjEyIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QTwvdGV4dD48L3N2Zz4=")';
    markerElement.style.backgroundSize = 'contain';
    markerElement.style.backgroundRepeat = 'no-repeat';
    markerElement.style.backgroundPosition = 'center';
    markerElement.style.cursor = 'pointer';

    const popup = new mapboxgl.Popup({
      offset: 25,
      closeButton: true,
      closeOnClick: true,
    }).setHTML(`
      <div style="font-family: Arial, sans-serif;">
        <h3 style="margin: 0 0 8px 0; font-size: 16px;">The Mall</h3>
        <p style="margin: 0 0 4px 0; color: #666;">📍 Bangkok, Thailand</p>
        <p style="margin: 0 0 4px 0; color: #666;">🎬 Cinema</p>
        <p style="margin: 0; color: #666;">🎤 Karaoke</p>
      </div>
    `);

    new mapboxgl.Marker({ element: markerElement })
      .setLngLat([100.5581, 13.6919])
      .setPopup(popup)
      .addTo(map.current!);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [tokenLoaded]);

  return <div ref={mapContainer} className={`w-full h-full ${className}`} />;
};

export default Map;
