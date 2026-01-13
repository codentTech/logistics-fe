# Frontend Review - OpsCore Integration

## 📋 Current Frontend Structure

### Technology Stack
- **Framework:** Next.js 15.3.1 (App Router)
- **State Management:** Redux Toolkit 2.7.0 + Redux Persist 6.0.0
- **UI Library:** Material-UI (MUI) 7.0.2
- **Styling:** Tailwind CSS 3.3.2 + Custom CSS/SCSS
- **Form Handling:** React Hook Form 7.56.0 + Yup 1.6.1
- **HTTP Client:** Axios 1.8.4
- **Notifications:** Notistack 3.0.2
- **Charts:** Recharts 2.15.3
- **Date Handling:** Day.js 1.11.13, date-fns 4.1.0

### Project Structure
```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── login/              # Login page
│   │   ├── sign-up/            # Sign up page
│   │   └── layout.jsx          # Root layout with Redux provider
│   ├── auth/                   # Auth wrapper components
│   │   ├── auth.component.jsx  # Auth router
│   │   ├── private.component.jsx  # Protected routes
│   │   └── auth-main-routes.component.jsx
│   ├── components/             # Page components
│   │   ├── login/
│   │   └── sign-up/
│   ├── common/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── custom-button/
│   │   │   ├── custom-input/
│   │   │   ├── custom-data-table/
│   │   │   ├── dashboard/     # Navbar, graphs
│   │   │   └── ... (many more)
│   │   ├── constants/          # Constants and configs
│   │   ├── hooks/              # Custom React hooks
│   │   ├── utils/              # Utility functions
│   │   │   ├── api.js          # Axios instance with interceptors
│   │   │   ├── access-token.util.js
│   │   │   └── users.util.js
│   │   └── styles/             # Global styles
│   └── provider/
│       ├── store.js            # Redux store configuration
│       └── features/
│           └── auth/           # Auth Redux slice
│               ├── auth.slice.js
│               └── auth.service.js
```

### Key Components Available

#### CustomButton
- Variants: primary, secondary, outline, danger, ghost, cancel
- Sizes: sm, md, lg
- Features: loading state, icons, disabled state
- Location: `src/common/components/custom-button/`

#### CustomInput
- Types: text, email, password, number, date, etc.
- Variants: default, bordered, minimal
- Sizes: sm, md, lg
- Features: validation, icons, error messages, React Hook Form integration
- Location: `src/common/components/custom-input/`

#### CustomDataTable
- Data table with pagination, sorting, filtering
- Location: `src/common/components/custom-data-table/`

### Current State

#### ✅ What's Working
1. **Redux Setup:** Store configured with Redux Persist
2. **API Client:** Axios instance with interceptors for auth and error handling
3. **Auth Structure:** Basic login/signup pages exist
4. **Custom Components:** Well-structured reusable components
5. **Routing:** Next.js App Router setup
6. **Styling:** Tailwind + MUI integration

#### ❌ What Needs to be Built
1. **OpsCore-Specific Pages:**
   - Dashboard (summary, stats)
   - Shipments list page
   - Create shipment page
   - Shipment details page
   - Assign driver modal/page
   - Update shipment status
   - Drivers list page
   - Driver location tracking (map view)

2. **Redux Slices:**
   - Shipments slice (list, create, update, assign driver)
   - Drivers slice (list, locations)
   - Dashboard slice (summary data)

3. **API Integration:**
   - Update `endpoints.js` with OpsCore endpoints
   - Create service files for shipments, drivers, dashboard
   - Update auth service to match OpsCore backend response format

4. **Real-time Features:**
   - Socket.IO client integration
   - Real-time driver location updates
   - Real-time shipment status updates

5. **Authentication:**
   - Update login to match OpsCore backend (`/v1/auth/login`)
   - Handle JWT token storage (different format than current)
   - Update token extraction logic

### API Configuration

#### Current API Setup
- Base URL: `process.env.NEXT_PUBLIC_MAIN_URL`
- Auth header: `Authorization: Bearer {token}`
- Token storage: `localStorage.getItem('user')` → `loginVerifiedToken[0].token`
- Error handling: Global interceptor with Notistack notifications

#### OpsCore Backend API Format
- Base URL: `http://localhost:3000` (dev)
- Endpoints: `/v1/auth/login`, `/v1/shipments`, etc.
- Response format:
  ```json
  {
    "success": true,
    "token": "eyJhbGci...",
    "user": { ... }
  }
  ```
- Error format:
  ```json
  {
    "success": false,
    "error_code": "UNAUTHORIZED",
    "message": "Error message"
  }
  ```

### Integration Plan

#### Phase 1: Authentication
1. Update `auth.service.js` to match OpsCore API
2. Update `access-token.util.js` to extract token from new format
3. Update login page to include `tenantId` field
4. Test login flow

#### Phase 2: Redux Setup
1. Create `shipments.slice.js` with async thunks
2. Create `drivers.slice.js`
3. Create `dashboard.slice.js`
4. Update `store.js` to include new slices

#### Phase 3: API Services
1. Create `shipments.service.js`
2. Create `drivers.service.js`
3. Create `dashboard.service.js`
4. Update `endpoints.js` with all OpsCore endpoints

#### Phase 4: Pages
1. Dashboard page (summary cards, charts)
2. Shipments list page (table with filters)
3. Create shipment page (form)
4. Shipment details page (view + actions)
5. Drivers list page (table + map view)

#### Phase 5: Real-time Integration
1. Install Socket.IO client
2. Create Socket.IO hook
3. Integrate real-time location updates
4. Integrate real-time status updates

#### Phase 6: Advanced Features
1. Map integration (Google Maps or Leaflet)
2. Driver location tracking on map
3. Route visualization
4. Status history timeline

### Design Considerations

#### User Preferences (from memories)
- **Colors:** Primary (indigo) and white only
- **Layout:** Compact, minimal padding/spacing
- **Text:** Smaller text, avoid huge cards
- **Components:** Use CustomButton and CustomInput (not default MUI)
- **Icons:** Minimal icons
- **Theme:** Professional, white background, black text, purple accents

#### Component Structure
- Separate UI (JSX) from logic (hooks)
- Use Redux for state management
- Global error/success handling in `api.js` (no redundant notifications)

### Environment Variables Needed

```env
NEXT_PUBLIC_MAIN_URL=http://localhost:3000
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

### Dependencies to Add

```json
{
  "socket.io-client": "^4.7.0",  // For real-time updates
  "leaflet": "^1.9.4",           // For maps (optional)
  "react-leaflet": "^4.2.1"     // React wrapper for Leaflet (optional)
}
```

### Next Steps

1. ✅ Review frontend structure (this document)
2. ⏭️ Update authentication to match OpsCore backend
3. ⏭️ Create Redux slices for shipments, drivers, dashboard
4. ⏭️ Create API services
5. ⏭️ Build dashboard page
6. ⏭️ Build shipments pages
7. ⏭️ Build drivers pages
8. ⏭️ Integrate Socket.IO for real-time updates
9. ⏭️ Add map integration for driver tracking
10. ⏭️ Testing and refinement

---

**Status:** Ready to start building OpsCore UI integration.

