export const PERMISSIONS = {
  MANAGE_USERS: ["admin"],
  VIEW_USERS: ["admin", "secretary"],
  MANAGE_PATIENTS: ["admin"],
  CREATE_PATIENT: ["admin", "doctor", "secretary"],
  UPDATE_PATIENT: ["admin", "doctor", "nurse"],
  VIEW_PATIENTS: ["admin", "doctor", "secretary"],
  MANAGE_APPOINTMENTS: ["admin", "secretary"],
  CREATE_APPOINTMENT: ["admin", "doctor", "secretary", "patient"],
  UPDATE_APPOINTMENT: ["admin", "doctor", "secretary"],
  COMPLETE_APPOINTMENT: ["doctor"],
  CANCEL_APPOINTMENT: ["admin", "doctor", "secretary", "patient"],
  VIEW_APPOINTMENTS: ["admin", "doctor", "secretary", "patient"],
};

export const hasPermission = (userRole, permission) => {
  const allowedRoles = PERMISSIONS[permission];
  return allowedRoles && allowedRoles.includes(userRole);
};
