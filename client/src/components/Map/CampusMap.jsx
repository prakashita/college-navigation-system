import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchMapData } from '../../services/api';
import '../../utils/fixLeafletIcons'; // fixes broken default marker icons in some setups

const CampusMap = () => {
  const [mapData, setMapData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchMapData();
        setMapData(data);
      } catch (error) {
        console.error('Failed to fetch map data:', error);
      }
    };
    loadData();
  }, []);

  const defaultPosition = [16.463251, 80.506759]; // SRM University-AP


  return (
    <MapContainer center={defaultPosition} zoom={16.5} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {/* Locations */}
      {mapData?.locations.map((loc) => (
        <Marker key={`loc-${loc.id}`} position={[parseFloat(loc.latitude), parseFloat(loc.longitude)]}>
          <Popup>{loc.name}</Popup>
        </Marker>
      ))}

      {/* Facilities */}
      {mapData?.facilities.map((fac) => (
        <Marker key={`fac-${fac.id}`} position={[parseFloat(fac.latitude), parseFloat(fac.longitude)]}>
          <Popup>{fac.name} ({fac.facility_type})</Popup>
        </Marker>
      ))}

      {/* Parking Spots */}
      {mapData?.parking_spots.map((park) => (
        <Marker key={`park-${park.id}`} position={[parseFloat(park.latitude), parseFloat(park.longitude)]}>
          <Popup>{park.name} - {park.status}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default CampusMap;
