export function getRoleLabel(user) {
  if (!user) return "Guest";
  if (user.role === "Admin" && user.position) return user.position;
  return user.role;
}

export function getPermissions(user) {
  if (!user) return {};

  const effectiveRole = (
    user.role === "Admin" && user.position ? user.position : user.role
  ).toLowerCase();

  const isPM = effectiveRole === "project manager";
  const isSupervisor = effectiveRole === "supervisor";
  const isLeader = effectiveRole === "project leader";
  const isDev = effectiveRole === "developer";

  return {
    isPM,
    isSupervisor,
    isLeader,
    isDev,
    isReadOnlyOversight: isPM,
    canViewRequests: isPM || isSupervisor || isLeader || isDev,
    canViewAllRequests: isPM || isSupervisor || isLeader,
    canViewSystems: true,
    canViewUsers: isPM || isSupervisor || isLeader,
    canViewReports: isPM || isSupervisor || isLeader,
    canViewSettings: isSupervisor || isLeader,
    canCreateRequest: isSupervisor || isLeader || isDev,
    canApproveMinorModerate: isSupervisor || isLeader,
    canApproveMajor: isSupervisor,
    canAssignDeveloper: isSupervisor || isLeader,
    canUpdateProgress: isSupervisor || isLeader || isDev,
    canVerifyAndComplete: isSupervisor,
    canDeleteRequest: isSupervisor,
    canManageSystems: isSupervisor,
    canManageUsers: isSupervisor,
  };
}
