# FoodShare Frontend

A React-based frontend application for the FoodShare platform, which connects food donors with receivers to reduce food waste.

## Features

- User authentication (login/register)
- Role-based access (donor/receiver)
- Food listing creation and management
- Food request system
- Real-time notifications
- Location-based search
- Responsive design

## Tech Stack

- React with TypeScript
- Material-UI for UI components
- React Router for navigation
- React Query for data fetching
- Axios for API requests
- Zod for form validation
- React Hook Form for form management

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/foodshare.git
   cd foodshare/foodshare-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```
   REACT_APP_API_URL=http://localhost:3000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`.

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── pages/         # Page components
  ├── hooks/         # Custom React hooks
  ├── services/      # API and other services
  ├── types/         # TypeScript type definitions
  ├── utils/         # Utility functions
  ├── assets/        # Static assets
  ├── App.tsx        # Main application component
  └── main.tsx       # Application entry point
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview the production build locally

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
