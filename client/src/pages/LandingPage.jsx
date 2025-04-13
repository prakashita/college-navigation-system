import { Link } from 'react-router-dom';
import { Container, Box, Typography, Button } from '@mui/material';

export default function LandingPage() {
  return (
    <Container maxWidth="md">
      <Box textAlign="center" sx={{ mt: 8 }}>
        <Typography variant="h3" gutterBottom>
          College Navigation System
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            component={Link}
            to="/login"
            sx={{ mr: 2 }}
          >
            Login
          </Button>
          <Button
            variant="outlined"
            component={Link}
            to="/signup"
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  );
}