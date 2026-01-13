# Port Configuration

## Port Setup
- **Backend**: Runs on port 5000
- **Frontend**: Runs on port 3000 (default)

## How to Use

1. **Backend** (port 5000):
   ```bash
   cd backend
   npm run dev
   ```
   Backend API: `http://localhost:5000`
   Swagger docs: `http://localhost:5000/docs`

2. **Frontend** (port 3000):
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend UI: `http://localhost:3000`

3. **Frontend Environment Variables** (`.env.local`):
   ```env
   NEXT_PUBLIC_MAIN_URL=http://localhost:5000
   NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
   ```

The frontend will make API calls to `http://localhost:5000` (backend) automatically.

