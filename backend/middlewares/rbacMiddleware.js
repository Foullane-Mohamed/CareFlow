import { PERMISSIONS, hasPermission } from "../config/permissions.js";



const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!hasPermission(req.user.role, permission)) {
      return res.status(403).json({
        message: " You do not have permission to this action",
      });
    }

    next();
  };
};

const checkPublicPermission = (permission) => {
  return (req, res, next) => {
    const { role } = req.body;
    const allowedRoles = PERMISSIONS[permission];

    if (!allowedRoles) {
      return res
        .status(500)
        .json({ message: "Permission configuration error" });
    }

    if (role && !allowedRoles.includes(role)) {
      req.body.role = allowedRoles[0];
    } else if (!role) {
      req.body.role = allowedRoles[0];
    }

    next();
  };
};




export {
  checkPermission,
  checkPublicPermission,
};
