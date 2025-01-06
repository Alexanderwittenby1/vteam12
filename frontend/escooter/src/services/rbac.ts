export const roles = {
  ADMIN: "admin",
  MODERATOR: "moderator",
  USER: "user",
};

export const permissions = {
  adminView: [roles.ADMIN],
  userView: [roles.USER],
};

export const hasPermission = (
  role: string,
  feature: keyof typeof permissions
) => {
  return permissions[feature]?.includes(role);
};
