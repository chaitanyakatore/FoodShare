export interface User {
  id: string;
  name: string;
  email: string;
  role: 'donor' | 'receiver' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface FoodListing {
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
    id: string;
    name: string;
  };
  requests: FoodRequest[];
  createdAt: string;
  updatedAt: string;
}

export interface FoodRequest {
  id: string;
  listingId: string;
  userId: string;
  status: 'pending' | 'accepted' | 'rejected';
  user: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
} 