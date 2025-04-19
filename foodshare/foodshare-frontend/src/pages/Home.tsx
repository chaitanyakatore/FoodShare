import { Container, Typography, Button, Grid, Box, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          py: 8,
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to FoodShare
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Connect with your community to share food and reduce waste
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            component={RouterLink}
            to="/listings"
            variant="contained"
            size="large"
            sx={{ mr: 2 }}
          >
            Browse Listings
          </Button>
          <Button
            component={RouterLink}
            to="/login"
            variant="outlined"
            size="large"
          >
            Get Started
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Home; 