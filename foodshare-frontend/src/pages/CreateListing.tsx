import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

const createListingSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  quantity: z.string().min(1, 'Quantity is required'),
  category: z.enum(['veg', 'non-veg']),
  expiryDate: z.string().min(1, 'Expiry date is required'),
  location: z.string().min(1, 'Location is required'),
  image: z.any().optional(),
});

type CreateListingFormData = z.infer<typeof createListingSchema>;

const CreateListing = () => {
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateListingFormData>({
    resolver: zodResolver(createListingSchema),
  });

  const createListingMutation = useMutation({
    mutationFn: async (data: CreateListingFormData) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      const response = await axios.post('/api/listings', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      reset();
      setImagePreview(null);
    },
    onError: (error) => {
      setError('Failed to create listing. Please try again.');
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: CreateListingFormData) => {
    try {
      setError(null);
      await createListingMutation.mutateAsync(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return (
      <Container>
        <Alert severity="error">Please log in to create a listing.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Create Food Listing
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Title"
            {...register('title')}
            error={!!errors.title}
            helperText={errors.title?.message}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={4}
            {...register('description')}
            error={!!errors.description}
            helperText={errors.description?.message}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Quantity"
            {...register('quantity')}
            error={!!errors.quantity}
            helperText={errors.quantity?.message}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              {...register('category')}
              error={!!errors.category}
            >
              <MenuItem value="veg">Vegetarian</MenuItem>
              <MenuItem value="non-veg">Non-Vegetarian</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Expiry Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            {...register('expiryDate')}
            error={!!errors.expiryDate}
            helperText={errors.expiryDate?.message}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Location"
            {...register('location')}
            error={!!errors.location}
            helperText={errors.location?.message}
            sx={{ mb: 2 }}
          />
          <Box sx={{ mb: 2 }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              id="image-upload"
            />
            <label htmlFor="image-upload">
              <Button variant="outlined" component="span" fullWidth>
                Upload Image
              </Button>
            </label>
            {imagePreview && (
              <Box sx={{ mt: 2 }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ maxWidth: '100%', maxHeight: '200px' }}
                />
              </Box>
            )}
          </Box>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Listing'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateListing; 