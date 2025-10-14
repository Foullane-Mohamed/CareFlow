# Permission System Usage

## Integration Examples

### Option 1: Role-based authorization

```javascript
import { authenticate } from "./middlewares/authMiddleware.js";
import { authorizeRoles } from "./middlewares/rbacMiddleware.js";

// Only admin can access
router.delete("/users/:id", authenticate, authorizeRoles("admin"), deleteUser);

// Admin or doctor can access
router.post(
  "/appointments",
  authenticate,
  authorizeRoles("admin", "doctor"),
  createAppointment
);
```

### Option 2: Permission-based authorization

```javascript
import { authenticate } from "./middlewares/authMiddleware.js";
import { checkPermission } from "./middlewares/rbacMiddleware.js";

// Use predefined permissions from config/permissions.js
router.post(
  "/patients",
  authenticate,
  checkPermission("CREATE_PATIENT"),
  createPatient
);
router.put(
  "/patients/:id",
  authenticate,
  checkPermission("UPDATE_PATIENT"),
  updatePatient
);
```

### Option 3: Ownership check

```javascript
import { authenticate } from "./middlewares/authMiddleware.js";
import { checkOwnership } from "./middlewares/rbacMiddleware.js";

// User can only access their own profile (admin bypasses this)
router.get("/users/:id", authenticate, checkOwnership("id"), getUserProfile);
```

### Option 4: Active user check

```javascript
import { authenticate } from "./middlewares/authMiddleware.js";
import { requireActiveUser } from "./middlewares/rbacMiddleware.js";

// Ensure user account is active
router.post(
  "/appointments",
  authenticate,
  requireActiveUser,
  createAppointment
);
```

### Option 5: Combined middleware

```javascript
import { authenticate } from "./middlewares/authMiddleware.js";
import {
  authorizeRoles,
  requireActiveUser,
} from "./middlewares/rbacMiddleware.js";

// Multiple checks
router.post(
  "/appointments/:id/complete",
  authenticate,
  requireActiveUser,
  authorizeRoles("doctor"),
  completeAppointment
);
```

## Add New Permissions

Edit `config/permissions.js`:

```javascript
export const PERMISSIONS = {
  // ... existing permissions
  NEW_PERMISSION: ["admin", "doctor"],
};
```

Then use in routes:

```javascript
router.post(
  "/resource",
  authenticate,
  checkPermission("NEW_PERMISSION"),
  handler
);
```

## Response Codes

- `401 Unauthorized` - No token or invalid token
- `403 Forbidden` - Valid token but insufficient permissions
