import { SessionUser } from "./auth";

export function requireRole(user: SessionUser, allowedRoles: string[]) {
  if (!allowedRoles.includes(user.role)) {
    throw new Error("Forbidden");
  }
}

export function requireOrganizationAccess(user: SessionUser, organizationId: string) {
  if (user.organizationId !== organizationId) {
    throw new Error("Organization mismatch");
  }
}
