"use client";

import dynamic from 'next/dynamic';

// Import RouteMap dynamically to avoid SSR issues with Leaflet
const RouteMap = dynamic(() => import('./RouteMap'), {
  ssr: false,
  loading: () => (
    <div className="h-96 w-full rounded-lg bg-gray-100 flex items-center justify-center">
      <div className="text-center text-gray-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
        <p>Cargando mapa...</p>
      </div>
    </div>
  )
});

export default RouteMap;
