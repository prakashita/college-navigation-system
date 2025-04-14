import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Box, Typography, MenuItem } from '@mui/material';
import API from '../../services/api';

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    user_type: '',
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.user_type) {
      alert('Please select a user type.');
      return;
    }
    try {
      const response = await API.post('/users/login', formData);
      localStorage.setItem('token', response.data.access_token);
      alert('Login successful!');
      if (formData.user_type === "admin") {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      alert('Login failed: ' + (error.response?.data?.detail || 'Unknown error'));
    }
  };

  return (
    <Container maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>
        <TextField
          fullWidth
          label="Username"
          margin="normal"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />
        <TextField
          fullWidth
          type="password"
          label="Password"
          margin="normal"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <TextField
          select
          fullWidth
          label="User Type"
          margin="normal"
          value={formData.user_type}
          onChange={(e) => setFormData({ ...formData, user_type: e.target.value })}
        >
          <MenuItem value="student">Student</MenuItem>
          <MenuItem value="faculty">Faculty</MenuItem>
          <MenuItem value="visitor">Visitor</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </TextField>
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Login
        </Button>
      </Box>
    </Container>
  );
}
