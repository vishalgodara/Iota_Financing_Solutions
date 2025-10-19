import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface DataPoint {
  id: number;
  city: string;
  lat: number;
  lng: number;
  value: string;
}

// Real Texas city coordinates
const dataPoints: DataPoint[] = [
  { id: 1, city: 'Austin', lat: 30.2672, lng: -97.7431, value: '2,450 vehicles' },
  { id: 2, city: 'Houston', lat: 29.7604, lng: -95.3698, value: '3,890 vehicles' },
  { id: 3, city: 'Dallas', lat: 32.7767, lng: -96.7970, value: '4,120 vehicles' },
  { id: 4, city: 'San Antonio', lat: 29.4241, lng: -98.4936, value: '2,780 vehicles' },
  { id: 5, city: 'El Paso', lat: 31.7619, lng: -106.4850, value: '1,650 vehicles' },
  { id: 6, city: 'Fort Worth', lat: 32.7555, lng: -97.3308, value: '2,340 vehicles' },
  { id: 7, city: 'Corpus Christi', lat: 27.8006, lng: -97.3964, value: '1,890 vehicles' },
  { id: 8, city: 'Amarillo', lat: 35.2220, lng: -101.8313, value: '1,230 vehicles' },
];

// Custom red marker icon
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export function TexasMap() {
  // Center of Texas with correct coordinates
  const center: [number, number] = [31.0, -99.0];

  return (
    <div style={{ width: '100%', height: '100vh' }} className="relative rounded-lg overflow-hidden">
      {/* Header Overlay */}
      <div className="absolute top-8 left-8 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg shadow-xl px-6 py-4">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl font-bold text-gray-900 mb-1"
        >
          🚗 Vehicle Inventory Across Texas
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-600 text-sm"
        >
          Interactive Real-Time Map • {dataPoints.length} Active Locations
        </motion.p>
      </div>

      {/* Leaflet Map */}
      <MapContainer
        center={center}
        zoom={6}
        style={{ height: '100vh', width: '100%', zIndex: 1 }}
        scrollWheelZoom={true}
        zoomControl={true}
        attributionControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Add markers for each city */}
        {dataPoints.map((point) => (
          <div key={point.id}>
            {/* Pulsing circle */}
            <Circle
              center={[point.lat, point.lng]}
              radius={50000}
              pathOptions={{
                color: '#ef4444',
                fillColor: '#ef4444',
                fillOpacity: 0.2,
                weight: 2,
              }}
            />
            
            {/* Marker with popup */}
            <Marker position={[point.lat, point.lng]} icon={redIcon}>
              <Popup>
                <div className="text-center p-2">
                  <h3 className="font-bold text-lg text-gray-900">{point.city}</h3>
                  <p className="text-sm text-gray-600 mt-1">{point.value}</p>
                  <button className="mt-2 px-4 py-1 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700">
                    View Inventory
                  </button>
                </div>
              </Popup>
            </Marker>
          </div>
        ))}
      </MapContainer>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute bottom-8 right-8 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl px-6 py-4 z-[1000] border-2 border-gray-200"
      >
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">📍</div>
            <span className="text-sm font-medium text-gray-700">Active Dealership</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-red-500 rounded-full bg-red-500/20"></div>
            <span className="text-sm font-medium text-gray-700">Coverage Area</span>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-500">Total Inventory</div>
          <div className="text-2xl font-bold text-blue-600">
            {dataPoints.reduce((sum, point) => sum + parseInt(point.value.replace(/[^\d]/g, '')), 0).toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-1">vehicles across Texas</div>
        </div>
      </motion.div>
    </div>
  );
}
