# OpsCore Frontend

A modern, real-time logistics management frontend built with Next.js, React, and Redux Toolkit.

## Features

- **Real-time Driver Tracking**: Live location updates via Socket.IO and MQTT
- **Driver Location Sharing**: Drivers can share their GPS location in real-time from web interface
- **Route Simulation**: Automatic driver movement simulation from pickup to delivery (follows actual roads)
- **Shipment Management**: Create, assign drivers, and track shipments through their lifecycle
- **Dashboard**: Real-time overview of shipments, drivers, and delivery statistics
- **Interactive Maps**: Leaflet-based maps showing driver locations in real-time
- **Map-based Address Picker**: Select pickup and delivery addresses using interactive map
- **Driver Filter**: Filter and focus on specific drivers on map view
- **Sticky Navigation**: Fixed sidebar and navbar for better user experience
- **Responsive Design**: Modern UI built with Tailwind CSS and custom components
- **Custom UI Components**: Professional custom-built components (buttons, inputs, selects, modals)

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
│   ├── app/                    # Next.js app router pages
│   │   ├── dashboard/          # Dashboard page
│   │   ├── drivers/            # Drivers list page
│   │   ├── driver-location/    # Driver location sharing page
│   │   ├── shipments/          # Shipments pages
│   │   └── login/              # Login page
│   ├── components/             # React components
│   │   ├── dashboard/          # Dashboard components
│   │   │   ├── dashboard.component.jsx
│   │   │   └── create-shipment-modal.component.jsx
│   │   ├── drivers/            # Driver-related components
│   │   │   ├── drivers-list.component.jsx
│   │   │   ├── drivers-map.component.jsx
│   │   │   └── driver-location-share.component.jsx
│   │   ├── shipments/          # Shipment components
│   │   │   ├── shipments-list.component.jsx
│   │   │   ├── shipment-details.component.jsx
│   │   │   └── driver-location-map.component.jsx
│   │   └── login/              # Login components
│   ├── common/                 # Shared utilities and components
│   │   ├── components/         # Reusable UI components
│   │   │   ├── custom-button/
│   │   │   ├── custom-input/
│   │   │   ├── simple-select/
│   │   │   ├── modal/
│   │   │   ├── loader/
│   │   │   ├── full-page-loader/
│   │   │   └── dashboard/navbar/
│   │   ├── hooks/              # Custom React hooks
│   │   │   └── use-socket.hook.js
│   │   ├── utils/              # Utility functions
│   │   │   ├── api.js          # Axios instance with interceptors
│   │   │   ├── access-token.util.js
│   │   │   └── users.util.js
│   │   └── styles/             # Global styles
│   │       └── globals.style.css
│   └── provider/               # Redux store and slices
│       ├── store.js            # Redux store configuration
│       └── features/           # Feature-based Redux slices
│           ├── auth/
│           ├── shipments/
│           ├── drivers/
│           └── dashboard/
└── public/                     # Static assets
```

## Key Features

### Real-time Location Updates

The frontend receives real-time driver location updates via Socket.IO:
- Automatic connection management
- Tenant-based room subscriptions
- Redux state updates for live map rendering
- Map markers update in real-time without page refresh
- Location data stored in `drivers.locations` Redux state

### Maps Integration

- **Dashboard Map**: Shows all active drivers with locations
- **Shipment Details Map**: Shows assigned driver's location with auto-centering
- **Driver List Map**: Toggle between list and map view
- **Address Picker**: Interactive map for selecting pickup and delivery addresses
- Uses React-Leaflet with dynamic marker updates
- Auto-centers on driver locations
- Handles missing location data gracefully
- Consistent zoom levels and precision across all maps
- **Driver Filter Dropdown**: Filter and focus on specific drivers on map
- **Real-time Route Simulation**: Watch drivers move along actual roads (OSRM routing)

### Custom Components

All UI components are custom-built (no Material-UI dependencies in UI):
- `CustomButton` - Button component with loading states and variants
- `CustomInput` - Input with validation, password visibility toggle, and proper styling
- `SimpleSelect` - Dropdown select component with search
- `Modal` - Modal dialog component for forms and confirmations
- `Loader` - Circular loading spinner
- `FullPageLoader` - Full-page loading indicator with ripple animation
- `Navbar` - Navigation bar with breadcrumbs and user menu (sticky)
- `AddressPicker` - Map-based address selection with geocoding
- **Sticky Sidebar** - Fixed sidebar navigation for easy access

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
- Automatically adds authentication tokens from localStorage
- Handles error responses globally
- Shows toast notifications for success/error (except location updates)
- Redirects to login on 401 errors
- Excludes location endpoint from success toasts (frequent updates)
- Centralized error handling to prevent duplicate error messages

## Real-time Features

### Socket.IO Connection

The `useSocket` hook manages the Socket.IO connection:
- Single global connection instance (prevents multiple connections)
- Automatic reconnection with exponential backoff
- Tenant room subscription (`tenant:{tenantId}`)
- Real-time location updates (`driver-location-update` event)
- Real-time shipment status updates (`shipment-status-update` event)
- Proper cleanup on component unmount

### Location Updates

Driver locations are updated in real-time:
- Received via Socket.IO events
- Stored in Redux state
- Automatically reflected on maps
- No page refresh required

### Route Simulation

When a driver is assigned to a shipment:
- System automatically simulates driver movement from pickup to delivery
- Driver follows actual roads using OSRM routing (not straight lines)
- Location updates every 3 seconds
- Continues until driver reaches delivery location
- Visible in real-time on all maps
- See backend [Route Simulation Guide](../ROUTE_SIMULATION.md) for details

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

