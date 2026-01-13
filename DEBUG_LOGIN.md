# Debug Login 401 Error

## Steps to Debug

1. **Open Browser DevTools** (F12 or Cmd+Option+I)
2. **Go to Network tab**
3. **Try to login**
4. **Click on the failed request** (`/v1/auth/login`)
5. **Check:**
   - **Request Payload** - What data is being sent?
   - **Response** - What error message is returned?

## Expected Request Payload

```json
{
  "email": "admin@tenant1.com",
  "password": "password123",
  "tenantId": "b3d2b424-99bd-4eb6-a9b9-f3697a9aaaa4"
}
```

## Common Issues

1. **Wrong Tenant ID** - Must be a valid UUID from seed output
2. **Wrong Email/Password** - Use exact credentials from seed
3. **Tenant not found** - Run `npm run seed` in backend
4. **User not active** - Check database

## Test Credentials (from seed)

- **Email:** `admin@tenant1.com`
- **Password:** `password123`
- **Tenant ID:** `b3d2b424-99bd-4eb6-a9b9-f3697a9aaaa4` (check seed output for current value)

## Quick Test

Run this in terminal to verify backend works:

```bash
curl -X POST http://localhost:5000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@tenant1.com",
    "password": "password123",
    "tenantId": "b3d2b424-99bd-4eb6-a9b9-f3697a9aaaa4"
  }'
```

If this works but frontend doesn't, check:
- Browser console for errors
- Network tab for request/response
- CORS headers

