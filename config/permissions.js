const PERMISSIONS = {
  CREATE_USER: ["admin"],
  MANAGE_USERS: ["admin"],
  VIEW_USERS: ["admin", "secretary"],
  MANAGE_PATIENTS: ["admin"],
  CREATE_PATIENT: ["admin", "doctor", "infirmier", "secretary"],
  UPDATE_PATIENT: ["admin", "doctor", "infirmier"],
  VIEW_PATIENTS: ["admin", "doctor", "infirmier", "secretary"],
  MANAGE_APPOINTMENTS: ["admin", "secretary"],
  CREATE_APPOINTMENT: ["admin", "doctor", "secretary", "patient"],
  UPDATE_APPOINTMENT: ["admin", "doctor", "secretary"],
  COMPLETE_APPOINTMENT: ["doctor"],
  CANCEL_APPOINTMENT: ["admin", "doctor", "secretary", "patient"],
  VIEW_APPOINTMENTS: ["admin", "doctor", "secretary", "patient"],
};

const PUBLIC_REGISTRATION_ALLOWED_ROLES = ["patient"];

const hasPermission = (userRole, permission) => {
  const allowedRoles = PERMISSIONS[permission];
  return allowedRoles && allowedRoles.includes(userRole);
};

const isPublicRegistrationRole = (role) => {
  return PUBLIC_REGISTRATION_ALLOWED_ROLES.includes(role);
};

export {
  PERMISSIONS,
  hasPermission,
  isPublicRegistrationRole,
  PUBLIC_REGISTRATION_ALLOWED_ROLES,
};
