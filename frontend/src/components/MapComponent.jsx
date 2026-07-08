import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix for default marker icons in Leaflet with Webpack/Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function ChangeView({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);
  return null;
}

export default function MapComponent({ parcelGeom, lines, empriseData }) {
  const parcelStyle = {
    color: '#00f2fe',
    weight: 3,
    fillColor: '#00f2fe',
    fillOpacity: 0.2
  };

  const lineStyle = {
    color: '#ef4444',
    weight: 4,
    opacity: 0.8,
    dashArray: '5, 10'
  };

  const empriseStyle = {
    color: '#10b981', // Emerald/Green
    weight: 3,
    opacity: 0.7,
  };

  let bounds = null;
  if (parcelGeom) {
    const geoJsonLayer = L.geoJSON(parcelGeom);
    bounds = geoJsonLayer.getBounds();
  }

  return (
    <div className="glass-card overflow-hidden h-[400px] relative">
      <MapContainer 
        center={[36.8, 10.2]} 
        zoom={10} 
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EBP, and the GIS User Community'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        
        {empriseData && (
          <GeoJSON 
            data={empriseData} 
            style={empriseStyle}
          />
        )}

        {parcelGeom && (
          <GeoJSON 
            data={parcelGeom} 
            style={parcelStyle}
          />
        )}

        {lines && lines.length > 0 && lines.map((line, index) => (
          <GeoJSON 
            key={index} 
            data={line.geometry} 
            style={lineStyle}
          />
        ))}

        {bounds && <ChangeView bounds={bounds} />}
      </MapContainer>
    </div>
  );
}
