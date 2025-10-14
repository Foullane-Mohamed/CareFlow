import { hasPermission } from "../config/permissions.js";

export const authorizeRoles = (...roles) => {
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

export const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!hasPermission(req.user.role, permission)) {
      return res
        .status(403)
        .json({
          message:
            "Forbidden: You do not have permission to perform this action",
        });
    }

    next();
  };
};

export const requireActiveUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!req.user.isActive) {
    return res.status(403).json({ message: "Forbidden: Account is suspended" });
  }

  next();
};

export const checkOwnership = (resourceIdParam = "id") => {
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
