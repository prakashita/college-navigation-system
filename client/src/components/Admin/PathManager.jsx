import { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TextField, Button, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import API from '../../services/api';

export default function PathManager() {
  const [data, setData] = useState({ locations: [], facilities: [], parking_spots: [], paths: [] });
  const [newPath, setNewPath] = useState({
    source_id: '',
    source_type: '',
    dest_id: '',
    dest_type: '',
    distance: 1
  });

  useEffect(() => {
    fetchAllMapData();
  }, []);

  const fetchAllMapData = async () => {
    try {
      const res = await API.get('/maps/maps/');
      setData(res.data);
    } catch (err) {
      console.error('Error fetching map data:', err);
    }
  };

  const allEntities = [
    ...data.locations.map(loc => ({ ...loc, type: 'location' })),
    ...data.facilities.map(fac => ({ ...fac, type: 'facility' })),
    ...data.parking_spots.map(park => ({ ...park, type: 'parking_spot' }))
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/maps/paths/', {
        ...newPath,
        distance: parseFloat(newPath.distance),
        source_id: parseInt(newPath.source_id),
        dest_id: parseInt(newPath.dest_id)
      });
      fetchAllMapData(); // refresh list
      setNewPath({ source_id: '', source_type: '', dest_id: '', dest_type: '', distance: 1 });
    } catch (err) {
      console.error('Error adding path:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/maps/paths/${id}`);
      fetchAllMapData();
    } catch (err) {
      console.error('Error deleting path:', err);
    }
  };
  const getName = (type, id) => {
    const entity = allEntities.find(e => e.type === type && e.id === id);
    return entity ? entity.name : `ID: ${id}`;
  };

  return (
    <div className="admin-section">
      <h2>Manage Paths</h2>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Source</InputLabel>
          <Select
            value={newPath.source_id ? `${newPath.source_type}-${newPath.source_id}` : ''}
            onChange={(e) => {
              const [type, id] = e.target.value.split('-');
              setNewPath({ ...newPath, source_type: type, source_id: id });
            }}
            required
          >
            {allEntities.map(item => (
              <MenuItem key={`${item.type}-${item.id}`} value={`${item.type}-${item.id}`}>
                {item.name || `ID ${item.id}`} ({item.type})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Destination</InputLabel>
          <Select
            value={newPath.dest_id ? `${newPath.dest_type}-${newPath.dest_id}` : ''}
            onChange={(e) => {
              const [type, id] = e.target.value.split('-');
              setNewPath({ ...newPath, dest_type: type, dest_id: id });
            }}
            required
          >
            {allEntities.map(item => (
              <MenuItem key={`${item.type}-${item.id}`} value={`${item.type}-${item.id}`}>
                {item.name || `ID ${item.id}`} ({item.type})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Distance"
          type="number"
          value={newPath.distance}
          onChange={(e) => setNewPath({ ...newPath, distance: e.target.value })}
          required
          inputProps={{ min: 1 }}
          fullWidth
        />

        <Button type="submit" variant="contained" sx={{ mt: 2 }}>Add Path</Button>
      </form>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Source</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Distance</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.paths.map((path) => (
              <TableRow key={path.id}>
                <TableCell>{getName(path.source_type, path.source_id)}</TableCell>
                <TableCell>{getName(path.dest_type, path.dest_id)}</TableCell>
                <TableCell>{path.distance}</TableCell>
                <TableCell>
                  <Button color="error" onClick={() => handleDelete(path.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
