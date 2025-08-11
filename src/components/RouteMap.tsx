"use client";

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface RouteMapProps {
  routeData: [number, number][];
  startPoint?: [number, number];
  endPoint?: [number, number];
  activityName?: string;
  className?: string;
}

const RouteMap: React.FC<RouteMapProps> = ({
  routeData,
  startPoint,
  endPoint,
  activityName = "Ruta",
  className = "h-96 w-full rounded-lg"
}) => {
  const mapRef = useRef<L.Map | null>(null);

  // Create custom icons for start and end points
  const startIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const endIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // Calculate center and bounds
  const calculateBounds = () => {
    if (routeData.length === 0) return null;
    
    // Filter out any invalid coordinates
    const validPoints = routeData.filter(point => 
      Array.isArray(point) && 
      point.length === 2 && 
      typeof point[0] === 'number' && 
      typeof point[1] === 'number' &&
      !isNaN(point[0]) && 
      !isNaN(point[1]) &&
      Math.abs(point[0]) <= 90 && 
      Math.abs(point[1]) <= 180
    );
    
    if (validPoints.length === 0) return null;
    
    const lats = validPoints.map(point => point[0]);
    const lngs = validPoints.map(point => point[1]);
    
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    
    return {
      southWest: [minLat, minLng] as [number, number],
      northEast: [maxLat, maxLng] as [number, number],
      center: [(minLat + maxLat) / 2, (minLng + maxLng) / 2] as [number, number],
      validPoints
    };
  };

  const bounds = calculateBounds();

  // Fit map to route when component mounts
  useEffect(() => {
    if (mapRef.current && bounds && routeData.length > 0) {
      const leafletBounds = L.latLngBounds(
        L.latLng(bounds.southWest[0], bounds.southWest[1]),
        L.latLng(bounds.northEast[0], bounds.northEast[1])
      );
      
      // Add some padding around the route
      mapRef.current.fitBounds(leafletBounds, { padding: [20, 20] });
    }
  }, [routeData, bounds]);

  if (!routeData || routeData.length === 0) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center`}>
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">🗺️</div>
          <p className="text-lg">No hay datos de ruta disponibles</p>
          <p className="text-sm">La actividad no incluye información de GPS</p>
        </div>
      </div>
    );
  }

  if (!bounds) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center`}>
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">⚠️</div>
          <p className="text-lg">Error al procesar la ruta</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <MapContainer
        center={bounds.center}
        zoom={13}
        className="h-full w-full rounded-lg"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Route polyline */}
        <Polyline
          positions={bounds.validPoints}
          color="#ff6600"
          weight={4}
          opacity={0.8}
        />
        
        {/* Start marker */}
        {startPoint && (
          <Marker position={startPoint} icon={startIcon}>
            <Popup>
              <div className="text-center">
                <strong>🏁 Inicio</strong>
                <br />
                {activityName}
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* End marker */}
        {endPoint && (
          <Marker position={endPoint} icon={endIcon}>
            <Popup>
              <div className="text-center">
                <strong>🏆 Final</strong>
                <br />
                {activityName}
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default RouteMap;
