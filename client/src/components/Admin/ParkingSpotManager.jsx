import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Select, MenuItem } from '@mui/material';
import API from '../../services/api';

export default function ParkingSpotManager() {
  const [spots, setSpots] = useState([]);
  const [newSpot, setNewSpot] = useState({ 
    name: '', 
    latitude: '', 
    longitude: '', 
    status: 'available' 
  });

  useEffect(() => {
    fetchSpots();
  }, []);

  const fetchSpots = async () => {
    try {
      const res = await API.get('/maps/parking_spots/');
      setSpots(res.data);
    } catch (err) {
      console.error('Error fetching parking spots:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/maps/parking_spots/', {
        ...newSpot,
        latitude: parseFloat(newSpot.latitude),
        longitude: parseFloat(newSpot.longitude)
      });
      fetchSpots();
      setNewSpot({ name: '', latitude: '', longitude: '', status: 'available' });
    } catch (err) {
      console.error('Error adding parking spot:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/maps/parking_spots/${id}`);
      fetchSpots();
    } catch (err) {
      console.error('Error deleting parking spot:', err);
    }
  };

  return (
    <div className="admin-section">
      <h2>Manage Parking Spots</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          value={newSpot.name}
          onChange={(e) => setNewSpot({ ...newSpot, name: e.target.value })}
          required
        />
        <TextField
          label="Latitude"
          type="number"
          value={newSpot.latitude}
          onChange={(e) => setNewSpot({ ...newSpot, latitude: e.target.value })}
          required
        />
        <TextField
          label="Longitude"
          type="number"
          value={newSpot.longitude}
          onChange={(e) => setNewSpot({ ...newSpot, longitude: e.target.value })}
          required
        />
        <Select
          value={newSpot.status}
          onChange={(e) => setNewSpot({ ...newSpot, status: e.target.value })}
        >
          <MenuItem value="available">Available</MenuItem>
          <MenuItem value="occupied">Occupied</MenuItem>
          <MenuItem value="under_maintenance">Maintenance</MenuItem>
        </Select>
        <Button type="submit" variant="contained">Add Spot</Button>
      </form>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Latitude</TableCell>
              <TableCell>Longitude</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {spots.map((spot) => (
              <TableRow key={spot.id}>
                <TableCell>{spot.name}</TableCell>
                <TableCell>{spot.latitude}</TableCell>
                <TableCell>{spot.longitude}</TableCell>
                <TableCell>{spot.status}</TableCell>
                <TableCell>
                  <Button color="error" onClick={() => handleDelete(spot.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}