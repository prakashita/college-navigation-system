import { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, Button, Select, MenuItem
} from '@mui/material';
import API from '../../services/api';

export default function FacilityManager() {
  const [facilities, setFacilities] = useState([]);
  const [newFacility, setNewFacility] = useState({
    name: '',
    latitude: '',
    longitude: '',
    facility_type: 'foodcourt'  // ✅ Default to a valid value
  });

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      const res = await API.get('/maps/facilities/');
      setFacilities(res.data);
    } catch (err) {
      console.error('Error fetching facilities:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/maps/facilities/', {
        ...newFacility,
        latitude: parseFloat(newFacility.latitude),
        longitude: parseFloat(newFacility.longitude)
      });
      fetchFacilities();
      setNewFacility({
        name: '',
        latitude: '',
        longitude: '',
        facility_type: 'foodcourt'  // ✅ Reset to valid default
      });
    } catch (err) {
      console.error('Error adding facility:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/maps/facilities/${id}`);
      fetchFacilities();
    } catch (err) {
      console.error('Error deleting facility:', err);
    }
  };

  return (
    <div className="admin-section">
      <h2>Manage Facilities</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          value={newFacility.name}
          onChange={(e) => setNewFacility({ ...newFacility, name: e.target.value })}
          required
        />
        <TextField
          label="Latitude"
          type="number"
          value={newFacility.latitude}
          onChange={(e) => setNewFacility({ ...newFacility, latitude: e.target.value })}
          required
        />
        <TextField
          label="Longitude"
          type="number"
          value={newFacility.longitude}
          onChange={(e) => setNewFacility({ ...newFacility, longitude: e.target.value })}
          required
        />
        <Select
          value={newFacility.facility_type}
          onChange={(e) => setNewFacility({ ...newFacility, facility_type: e.target.value })}
        >
          <MenuItem value="foodcourt">Food Court</MenuItem>
          <MenuItem value="restroom">Restroom</MenuItem>
          <MenuItem value="emergency_exit">Emergency Exit</MenuItem>
        </Select>
        <Button type="submit" variant="contained">Add Facility</Button>
      </form>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Latitude</TableCell>
              <TableCell>Longitude</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {facilities.map((facility) => (
              <TableRow key={facility.id}>
                <TableCell>{facility.name}</TableCell>
                <TableCell>{facility.facility_type}</TableCell>
                <TableCell>{facility.latitude}</TableCell>
                <TableCell>{facility.longitude}</TableCell>
                <TableCell>
                  <Button color="error" onClick={() => handleDelete(facility.id)}>
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
