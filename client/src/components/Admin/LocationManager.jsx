import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button } from '@mui/material';
import API from '../../services/api';

export default function LocationManager() {
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState({ name: '', latitude: '', longitude: '' });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await API.get('/maps/locations/');
      setLocations(res.data);
    } catch (err) {
      console.error('Error fetching locations:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/maps/locations/', {
        name: newLocation.name,
        latitude: parseFloat(newLocation.latitude),
        longitude: parseFloat(newLocation.longitude)
      });
      fetchLocations();
      setNewLocation({ name: '', latitude: '', longitude: '' });
    } catch (err) {
      console.error('Error adding location:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/maps/locations/${id}`);
      fetchLocations();
    } catch (err) {
      console.error('Error deleting location:', err);
    }
  };

  return (
    <div className="admin-section">
      <h2>Manage Locations</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          value={newLocation.name}
          onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
          required
        />
        <TextField
          label="Latitude"
          type="number"
          value={newLocation.latitude}
          onChange={(e) => setNewLocation({ ...newLocation, latitude: e.target.value })}
          required
        />
        <TextField
          label="Longitude"
          type="number"
          value={newLocation.longitude}
          onChange={(e) => setNewLocation({ ...newLocation, longitude: e.target.value })}
          required
        />
        <Button type="submit" variant="contained">Add Location</Button>
      </form>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Latitude</TableCell>
              <TableCell>Longitude</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {locations.map((location) => (
              <TableRow key={location.id}>
                <TableCell>{location.name}</TableCell>
                <TableCell>{location.latitude}</TableCell>
                <TableCell>{location.longitude}</TableCell>
                <TableCell>
                  <Button color="error" onClick={() => handleDelete(location.id)}>
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