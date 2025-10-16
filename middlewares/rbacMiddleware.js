import { hasPermission } from "../config/permissions.js";

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden: Insufficient permissions" });
    }

    next();
  };
};

const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!hasPermission(req.user.role, permission)) {
      return res.status(403).json({
        message: "Forbidden: You do not have permission to perform this action",
      });
    }

    next();
  };
};

const requireActiveUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!req.user.isActive) {
    return res.status(403).json({ message: "Forbidden: Account is suspended" });
  }

  next();
};

const checkOwnership = (resourceIdParam = "id") => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const resourceId = req.params[resourceIdParam];
    const userId = req.user._id.toString();

    if (req.user.role === "admin") {
      return next();
    }

    if (resourceId !== userId) {
      return res
        .status(403)
        .json({ message: "Forbidden: You can only access your own resources" });
    }

    next();
  };
};

export { authorizeRoles, checkPermission, requireActiveUser, checkOwnership };
