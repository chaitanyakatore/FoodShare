import { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface FoodListing {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  quantity: string;
  expiryDate: string;
  location: string;
  category: 'veg' | 'non-veg';
  status: 'available' | 'pending' | 'collected';
  donor: {
    name: string;
    id: string;
  };
}

const FoodListings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [status, setStatus] = useState<'all' | 'available' | 'pending' | 'collected'>('all');

  const { data: listings, isLoading } = useQuery<FoodListing[]>({
    queryKey: ['listings'],
    queryFn: async () => {
      const response = await axios.get('/api/listings');
      return response.data;
    },
  });

  const filteredListings = listings?.filter((listing) => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || listing.category === category;
    const matchesStatus = status === 'all' || listing.status === status;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (isLoading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Available Food Listings
      </Typography>

      {/* Filters */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value as any)}
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="veg">Vegetarian</MenuItem>
                <MenuItem value="non-veg">Non-Vegetarian</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value as any)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="collected">Collected</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Listings Grid */}
      <Grid container spacing={4}>
        {filteredListings?.map((listing) => (
          <Grid item key={listing.id} xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={listing.imageUrl || '/placeholder-food.jpg'}
                alt={listing.title}
              />
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  {listing.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {listing.description}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={listing.category === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
                    color={listing.category === 'veg' ? 'success' : 'error'}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={listing.status}
                    color={
                      listing.status === 'available'
                        ? 'success'
                        : listing.status === 'pending'
                        ? 'warning'
                        : 'default'
                    }
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Quantity: {listing.quantity}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Expires: {new Date(listing.expiryDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Location: {listing.location}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Donor: {listing.donor.name}
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={listing.status !== 'available'}
                >
                  {listing.status === 'available' ? 'Request Food' : 'Unavailable'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default FoodListings; 