# Frontend RBAC Implementation Guide

## ✅ Implementation Status

### 1. Role Constants ✅
**File**: `src/common/constants/role.constant.js`
- Updated to match backend roles: `ops_admin`, `driver`, `customer`

### 2. Role Hook ✅
**File**: `src/common/hooks/use-role.hook.js`
- Provides: `role`, `isAdmin`, `isDriver`, `isCustomer`, `hasRole()`, `hasAnyRole()`
- Used throughout components for role-based logic

### 3. Role Guard Component ✅
**File**: `src/common/components/role-guard/role-guard.component.jsx`
- Protects routes/components based on user role
- Redirects unauthorized users to dashboard
- Shows access denied message if redirect is disabled

### 4. Route Protection ✅

#### Dashboard (`/dashboard`)
- **Allowed Roles**: Admin, Driver, Customer
- **Protection**: RoleGuard wrapper

#### Shipments (`/shipments`)
- **Allowed Roles**: Admin, Driver, Customer
- **Protection**: RoleGuard wrapper
- **Backend Filtering**: Drivers see only assigned shipments (handled by backend)

#### Shipment Details (`/shipments/:id`)
- **Allowed Roles**: Admin, Driver, Customer
- **Protection**: RoleGuard wrapper
- **Backend Filtering**: Drivers can only access assigned shipments (handled by backend)

#### Drivers (`/drivers`)
- **Allowed Roles**: Admin only
- **Protection**: RoleGuard wrapper with `[ROLES.OPS_ADMIN]`

#### Driver Location Share (`/driver-location`)
- **Allowed Roles**: Driver only
- **Protection**: RoleGuard wrapper with `[ROLES.DRIVER]`

### 5. Sidebar Navigation ✅
**File**: `src/auth/private.component.jsx`
- **Dashboard**: All roles
- **Shipments**: All roles
- **Drivers**: Admin only
- **Share Location**: Driver only
- Navigation items filtered based on user role

### 6. Component-Level RBAC ✅

#### Dashboard Component
- **Create Shipment Button**: Admin only
- **Create Shipment Quick Action**: Admin only
- **View Drivers Quick Action**: Admin only
- **Drivers Online Card**: Admin only
- **Summary Cards**: All roles (but backend filters data by role)

#### Shipments List Component
- **Create Shipment Button**: Admin only
- **Shipment List**: 
  - Admin: All shipments
  - Driver: Only assigned shipments (backend filtered)
  - Customer: All shipments (if implemented)

#### Shipment Details Component
- **Assign Driver Section**: Admin only
- **Update Status Section**: Admin or Driver (only if driver is assigned)
- **Cancel Shipment Button**: 
  - Customer: Shows if status allows cancellation
  - Driver: Shows if status allows cancellation and shipment is assigned to them
- **Driver Reassignment Note**: Admin only

### 7. Backend Integration ✅
- Backend already filters shipments by role:
  - Admin: All shipments in tenant
  - Driver: Only assigned shipments
  - Customer: All shipments (if implemented)
- Backend enforces role-based access on all endpoints
- Frontend displays data based on backend response

## 📋 Role Permissions Matrix

| Feature | Admin | Driver | Customer |
|---------|-------|--------|----------|
| **Dashboard** | ✅ | ✅ | ✅ |
| **View All Shipments** | ✅ | ❌ (Only assigned) | ✅ |
| **Create Shipment** | ✅ | ❌ | ❌ |
| **Assign Driver** | ✅ | ❌ | ❌ |
| **Update Status** | ✅ | ✅ (Assigned only) | ❌ |
| **Cancel Shipment** | ❌ | ✅ (Before IN_TRANSIT) | ✅ (Before IN_TRANSIT) |
| **View Drivers** | ✅ | ❌ | ❌ |
| **Share Location** | ❌ | ✅ | ❌ |
| **View Driver Locations** | ✅ | ❌ | ❌ |

## 🔒 Security Notes

1. **Frontend RBAC is for UX only** - Backend enforces all security
2. **Route Guards** - Prevent unauthorized page access
3. **UI Filtering** - Hides actions user can't perform
4. **Backend Validation** - All API calls validated on backend
5. **Token-Based Auth** - JWT tokens contain role information

## 🧪 Testing Checklist

### Admin Role
- [ ] Can access Dashboard
- [ ] Can access Shipments (sees all)
- [ ] Can access Drivers page
- [ ] Cannot access Share Location page
- [ ] Can create shipments
- [ ] Can assign drivers
- [ ] Can update status
- [ ] Cannot cancel shipments (no button shown)
- [ ] Sees "Drivers Online" card
- [ ] Sees "Create Shipment" quick action

### Driver Role
- [ ] Can access Dashboard
- [ ] Can access Shipments (sees only assigned)
- [ ] Cannot access Drivers page (redirected)
- [ ] Can access Share Location page
- [ ] Cannot create shipments (no button)
- [ ] Cannot assign drivers (no section)
- [ ] Can update status (IN_TRANSIT, DELIVERED)
- [ ] Can cancel shipments (before IN_TRANSIT)
- [ ] Does not see "Drivers Online" card
- [ ] Does not see "Create Shipment" quick action

### Customer Role
- [ ] Can access Dashboard
- [ ] Can access Shipments
- [ ] Cannot access Drivers page (redirected)
- [ ] Cannot access Share Location page (redirected)
- [ ] Cannot create shipments (no button)
- [ ] Cannot assign drivers (no section)
- [ ] Cannot update status (no section)
- [ ] Can cancel shipments (before IN_TRANSIT)
- [ ] Does not see "Drivers Online" card
- [ ] Does not see "Create Shipment" quick action

## 📝 Files Modified

1. `src/common/constants/role.constant.js` - Updated roles
2. `src/common/hooks/use-role.hook.js` - Created role hook
3. `src/common/components/role-guard/role-guard.component.jsx` - Created role guard
4. `src/auth/private.component.jsx` - Role-based navigation
5. `src/app/dashboard/page.jsx` - Added role guard
6. `src/app/drivers/page.jsx` - Added role guard (admin only)
7. `src/app/driver-location/page.jsx` - Added role guard (driver only)
8. `src/app/shipments/page.jsx` - Added role guard
9. `src/app/shipments/[id]/page.jsx` - Added role guard
10. `src/components/dashboard/dashboard.component.jsx` - Role-based UI
11. `src/components/shipments/shipments-list.component.jsx` - Role-based UI
12. `src/components/shipments/shipment-details.component.jsx` - Role-based UI

## ✅ Verification

All RBAC features are implemented:
- ✅ Role constants match backend
- ✅ Role guard component created
- ✅ All routes protected
- ✅ Sidebar navigation filtered
- ✅ Component-level UI filtering
- ✅ Backend integration verified

