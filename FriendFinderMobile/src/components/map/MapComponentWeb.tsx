// ─── MapComponentWeb ──────────────────────────────────────────────────────────────

import React, { useEffect, useState } from 'react';
import { View, DimensionValue, Image, Text, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { configService } from '../../service/map.service';

interface MapPin {
  id: string;
  title: string;
  longitude: number;
  latitude: number;
}

interface MapComponentWebProps {
  pins?: MapPin[];
  centerCoordinate?: [number, number];
  onPinPress?: (pin: MapPin) => void;
  height?: DimensionValue;
}

const MapComponentWeb: React.FC<MapComponentWebProps> = ({
  pins = [],
  centerCoordinate = [100.8861, 13.7563], // Bangkok default
  onPinPress,
  height = 300,
}) => {
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        console.log('MapComponentWeb: Fetching Mapbox token...');
        const token = await configService.getMapboxToken();
        console.log('MapComponentWeb: Token received:', token ? 'yes' : 'no');
        setMapboxToken(token);
      } catch (error) {
        console.error('Failed to fetch Mapbox token:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchToken();
  }, []);

  // If loading, show loading spinner
  if (isLoading) {
    return (
      <View style={{ height, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: 12 }}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  // If no token, show static map image
  if (!mapboxToken) {
    const lat = centerCoordinate[1];
    const lng = centerCoordinate[0];
    const markerString = pins.map(p => `${p.latitude},${p.longitude}`).join('|');
    const staticMapUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${markerString ? markerString + '/' : ''}${lng},${lat},12,0/400x300@2x?access_token=${mapboxToken || 'pk_eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycW1ucWRkeXNzZW8ifQ.rJcFIG214AriISLbB6B6MA'}`;

    return (
      <View style={{ height, borderRadius: 12, overflow: 'hidden', backgroundColor: '#f0f0f0' }}>
        <Image
          source={{ uri: staticMapUrl }}
          style={{ flex: 1 }}
          resizeMode="cover"
        />
        <View style={{ position: 'absolute', bottom: 10, left: 10, backgroundColor: '#fff', padding: 8, borderRadius: 4 }}>
          <Text style={{ fontSize: 12, color: '#666' }}>ต้องการให้ Mapbox Token</Text>
        </View>
      </View>
    );
  }

  // Create HTML for Mapbox web map
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset='utf-8' />
      <title>Map</title>
      <meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no' />
      <script src='https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js'></script>
      <link href='https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css' rel='stylesheet' />
      <style>
        body { margin: 0; padding: 0; }
        #map { position: absolute; top: 0; bottom: 0; width: 100%; }
      </style>
    </head>
    <body>
      <div id='map'></div>
      <script>
        mapboxgl.accessToken = '${mapboxToken}';
        const map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [${centerCoordinate[0]}, ${centerCoordinate[1]}],
          zoom: 12
        });

        ${pins
          .map(
            pin => `
          new mapboxgl.Marker()
            .setLngLat([${pin.longitude}, ${pin.latitude}])
            .setPopup(new mapboxgl.Popup().setHTML('<h3>${pin.title}</h3>'))
            .addTo(map);
        `
          )
          .join('\n')}
      </script>
    </body>
    </html>
  `;

  return (
    <View style={{ height, borderRadius: 12, overflow: 'hidden' }}>
      <WebView
        source={{ html: htmlContent }}
        style={{ flex: 1 }}
        javaScriptEnabled
        domStorageEnabled
      />
    </View>
  );
};

export default MapComponentWeb;
