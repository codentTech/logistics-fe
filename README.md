# OpsCore Frontend

A modern, real-time logistics management frontend built with Next.js, React, and Redux Toolkit.

## Features

- **Real-time Driver Tracking**: Live location updates via Socket.IO and MQTT
- **Shipment Management**: Create, assign drivers, and track shipments through their lifecycle
- **Dashboard**: Real-time overview of shipments, drivers, and delivery statistics
- **Interactive Maps**: Leaflet-based maps showing driver locations in real-time
- **Responsive Design**: Modern UI built with Tailwind CSS and custom components

## Tech Stack

- **Framework**: Next.js 15.3.1
- **UI Library**: React 19
- **State Management**: Redux Toolkit with Redux Persist
- **Styling**: Tailwind CSS, Material-UI (MUI)
- **Maps**: React-Leaflet, Leaflet
- **Real-time**: Socket.IO Client
- **Forms**: React Hook Form with Yup validation
- **HTTP Client**: Axios
- **Icons**: Lucide React, Material-UI Icons

## Prerequisites

- Node.js >= 18.17.0
- npm >= 9.0.0
- Backend API running (see backend README)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_MAIN_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

3. Update the environment variables with your backend URL if different from the default.

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Available Scripts

- `npm run dev` - Start development server with Turbo
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Run TypeScript type checking
- `npm run analyze` - Analyze bundle size
- `npm run clean` - Clean build artifacts and cache

## Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── dashboard/    # Dashboard page
│   │   ├── drivers/      # Drivers list page
│   │   ├── shipments/    # Shipments pages
│   │   └── login/        # Login page
│   ├── components/       # React components
│   │   ├── dashboard/    # Dashboard components
│   │   ├── drivers/      # Driver-related components
│   │   ├── shipments/    # Shipment components
│   │   └── login/        # Login components
│   ├── common/           # Shared utilities and components
│   │   ├── components/   # Reusable UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── utils/        # Utility functions
│   │   └── styles/       # Global styles
│   └── provider/         # Redux store and slices
│       ├── store.js      # Redux store configuration
│       └── features/     # Feature-based Redux slices
└── public/               # Static assets
```

## Key Features

### Real-time Location Updates

The frontend receives real-time driver location updates via Socket.IO:
- Automatic connection management
- Tenant-based room subscriptions
- Redux state updates for live map rendering

### Custom Components

All UI components are custom-built:
- `CustomButton` - Button component with loading states
- `CustomInput` - Input with validation and password visibility
- `SimpleSelect` - Dropdown select component
- `Modal` - Modal dialog component
- `Loader` - Circular loading spinner

### State Management

Redux Toolkit is used for:
- Authentication state
- Shipments management
- Drivers and locations
- Dashboard summary

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_MAIN_URL` | Backend API base URL | `http://localhost:5000` |
| `NEXT_PUBLIC_SOCKET_URL` | Socket.IO server URL | `http://localhost:5000` |

## Authentication

The frontend uses JWT tokens stored in localStorage. The token is automatically included in API requests via Axios interceptors.

## API Integration

All API calls are made through a centralized Axios instance (`src/common/utils/api.js`) that:
- Automatically adds authentication tokens
- Handles error responses
- Shows toast notifications for success/error
- Redirects to login on 401 errors

## Real-time Features

### Socket.IO Connection

The `useSocket` hook manages the Socket.IO connection:
- Single global connection instance
- Automatic reconnection
- Tenant room subscription
- Real-time location and shipment updates

### Location Updates

Driver locations are updated in real-time:
- Received via Socket.IO events
- Stored in Redux state
- Automatically reflected on maps
- No page refresh required

## Building for Production

```bash
npm run build
npm run start
```

The production build will be optimized and minified.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Private - All rights reserved

