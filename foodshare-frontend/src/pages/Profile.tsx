import { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

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
  requests: Array<{
    id: string;
    user: {
      name: string;
      id: string;
    };
    status: 'pending' | 'accepted' | 'rejected';
  }>;
}

const Profile = () => {
  const { user, logout } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState<{
    listingId: string;
    requestId: string;
  } | null>(null);
  const queryClient = useQueryClient();

  const { data: listings, isLoading } = useQuery<FoodListing[]>({
    queryKey: ['userListings'],
    queryFn: async () => {
      const response = await axios.get('/api/listings/user');
      return response.data;
    },
    enabled: !!user,
  });

  const updateRequestStatusMutation = useMutation({
    mutationFn: async ({
      listingId,
      requestId,
      status,
    }: {
      listingId: string;
      requestId: string;
      status: 'accepted' | 'rejected';
    }) => {
      const response = await axios.put(
        `/api/listings/${listingId}/requests/${requestId}`,
        { status }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userListings'] });
      setSelectedRequest(null);
    },
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleRequestAction = (listingId: string, requestId: string) => {
    setSelectedRequest({ listingId, requestId });
  };

  const handleRequestStatusUpdate = (status: 'accepted' | 'rejected') => {
    if (selectedRequest) {
      updateRequestStatusMutation.mutate({
        listingId: selectedRequest.listingId,
        requestId: selectedRequest.requestId,
        status,
      });
    }
  };

  if (!user) {
    return (
      <Container>
        <Typography>Please log in to view your profile.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ mt: 4 }}>
        <Box sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Profile
          </Typography>
          <Typography variant="h6" gutterBottom>
            {user.name}
          </Typography>
          <Typography color="text.secondary" gutterBottom>
            {user.email}
          </Typography>
          <Typography color="text.secondary" gutterBottom>
            Role: {user.role}
          </Typography>
          <Button
            variant="outlined"
            color="error"
            onClick={logout}
            sx={{ mt: 2 }}
          >
            Logout
          </Button>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="My Listings" />
            <Tab label="Requests" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {isLoading ? (
            <Typography>Loading...</Typography>
          ) : (
            <Grid container spacing={4}>
              {listings?.map((listing) => (
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
                      {listing.requests.length > 0 && (
                        <Button
                          fullWidth
                          variant="outlined"
                          onClick={() => handleRequestAction(listing.id, listing.requests[0].id)}
                        >
                          View Requests ({listing.requests.length})
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={4}>
            {listings?.map((listing) =>
              listing.requests.map((request) => (
                <Grid item key={request.id} xs={12} sm={6} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" component="h2" gutterBottom>
                        {listing.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Requested by: {request.user.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Status: {request.status}
                      </Typography>
                      {request.status === 'pending' && (
                        <Box sx={{ mt: 2 }}>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => handleRequestStatusUpdate('accepted')}
                            sx={{ mr: 1 }}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleRequestStatusUpdate('rejected')}
                          >
                            Reject
                          </Button>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </TabPanel>
      </Paper>

      <Dialog
        open={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
      >
        <DialogTitle>Request Details</DialogTitle>
        <DialogContent>
          {/* Add request details here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedRequest(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile; 