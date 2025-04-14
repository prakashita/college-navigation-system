import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchMapData, fetchShortestRoute } from '../../services/api';
import '../../utils/fixLeafletIcons';

const CampusMap = () => {
  const [mapData, setMapData] = useState(null);
  const [start, setStart] = useState({ id: '', type: '' });
  const [end, setEnd] = useState({ id: '', type: '' });
  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState(null);

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

  const handleFindRoute = async () => {
    if (!start.id || !start.type || !end.id || !end.type) return;

    try {
      const result = await fetchShortestRoute(start.id, start.type, end.id, end.type);
      const { path, total_distance } = result;

      const coordinatePath = path.map(([id, type]) => {
        let itemList = [];
        if (type === 'location') itemList = mapData.locations || [];
        else if (type === 'facility') itemList = mapData.facilities || [];
        else if (type === 'parking_spot') itemList = mapData.parking_spots || [];

        const point = itemList.find(p => parseInt(p.id) === parseInt(id));

        if (!point || !point.latitude || !point.longitude) return null;

        return {
          latitude: parseFloat(point.latitude),
          longitude: parseFloat(point.longitude),
          name: point.name,
          type,
        };
      }).filter(Boolean);

      if (coordinatePath.length >= 2) {
        setRoute(coordinatePath);
        setDistance(total_distance);
      } else {
        console.error('Incomplete route data. Skipping display.');
        setRoute([]);
        setDistance(null);
      }
    } catch (error) {
      console.error('Failed to fetch route:', error);
    }
  };

  const defaultPosition = [16.463251, 80.506759]; // SRM University-AP

  const allPoints = [
    ...(mapData?.locations || []).map(loc => ({ ...loc, type: 'location' })),
    ...(mapData?.facilities || []).map(fac => ({ ...fac, type: 'facility' })),
    ...(mapData?.parking_spots || []).map(park => ({ ...park, type: 'parking_spot' })),
  ];

  return (
    <>
      {/* UI: Route Selector */}
      <div style={{ padding: '10px', backgroundColor: '#fff', zIndex: 1000, position: 'absolute', top: 10, left: 10 }}>
        <h4>Find Shortest Route</h4>
        <select onChange={(e) => {
          const [id, type] = e.target.value.split('|');
          setStart({ id, type });
        }}>
          <option value="">Select Start Point</option>
          {allPoints.map(p => (
            <option key={`${p.type}-${p.id}`} value={`${p.id}|${p.type}`}>
              {p.name} ({p.type})
            </option>
          ))}
        </select>

        <select onChange={(e) => {
          const [id, type] = e.target.value.split('|');
          setEnd({ id, type });
        }}>
          <option value="">Select End Point</option>
          {allPoints.map(p => (
            <option key={`${p.type}-${p.id}`} value={`${p.id}|${p.type}`}>
              {p.name} ({p.type})
            </option>
          ))}
        </select>

        <button onClick={handleFindRoute}>Find Route</button>

        {/* Text Route Instruction */}
        {route.length > 1 && (
          <div style={{ marginTop: '10px' }}>
            <strong>Route:</strong><br />
            {route.map((point, index) => (
              <div key={index}>
                {index + 1}. {point.name} ({point.type})
              </div>
            ))}
            {distance && <div style={{ marginTop: '5px' }}>Total Distance: {distance} meters</div>}
          </div>
        )}
      </div>

      {/* Map Rendering */}
      <MapContainer center={defaultPosition} zoom={16.5} style={{ height: '100vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* Markers */}
        {mapData?.locations.map((loc) => (
          <Marker key={`loc-${loc.id}`} position={[parseFloat(loc.latitude), parseFloat(loc.longitude)]}>
            <Popup>{loc.name}</Popup>
          </Marker>
        ))}
        {mapData?.facilities.map((fac) => (
          <Marker key={`fac-${fac.id}`} position={[parseFloat(fac.latitude), parseFloat(fac.longitude)]}>
            <Popup>{fac.name} ({fac.facility_type})</Popup>
          </Marker>
        ))}
        {mapData?.parking_spots.map((park) => (
          <Marker key={`park-${park.id}`} position={[parseFloat(park.latitude), parseFloat(park.longitude)]}>
            <Popup>{park.name} - {park.status}</Popup>
          </Marker>
        ))}

        {/* Polyline for route */}
        {route.length > 1 && (
          <Polyline positions={route.map(p => [p.latitude, p.longitude])} color="blue" />
        )}
      </MapContainer>
    </>
  );
};

export default CampusMap;
