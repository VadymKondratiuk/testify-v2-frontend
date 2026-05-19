export const ROLES = ["STUDENT", "TEACHER", "ADMIN"] as const;

export type Role = (typeof ROLES)[number];

export type AuthSession = {
  isAuthenticated: boolean;
  role: Role | null;
};

export const AUTH_COOKIE_NAME = "testify_session";
export const REFRESH_COOKIE_NAME = "testify_refresh";
export const SIGNED_ROLE_COOKIE_NAME = "testify_role_sig";
export const LEGACY_ROLE_COOKIE_NAME = "testify_role";

export const AUTHENTICATED_ROLES: readonly Role[] = ROLES;
export const CREATOR_STUDIO_ROLES: readonly Role[] = ["TEACHER"];
export const ADMIN_ROLES: readonly Role[] = ["ADMIN"];

const GUEST_ONLY_PATHS = ["/login", "/register"] as const;
const AUTHENTICATED_PATH_PREFIXES = ["/profile", "/settings", "/history", "/results"] as const;
const CREATOR_PATH_PREFIXES = ["/creator-studio"] as const;
const ADMIN_PATH_PREFIXES = ["/admin"] as const;
const TAKE_TEST_PATH_PATTERN = /^\/tests\/[^/]+\/take(?:\/.*)?$/;

export function normalizeRole(value: string | null | undefined): Role | null {
  if (!value) return null;

  const normalizedValue = value.toUpperCase();
  return ROLES.find((role) => role === normalizedValue) ?? null;
}

export function isPathMatch(pathname: string, routePath: string) {
  return pathname === routePath || pathname.startsWith(`${routePath}/`);
}

export function isGuestOnlyPath(pathname: string) {
  return GUEST_ONLY_PATHS.some((path) => isPathMatch(pathname, path));
}

export function getRequiredRoles(pathname: string): readonly Role[] | null {
  if (ADMIN_PATH_PREFIXES.some((path) => isPathMatch(pathname, path))) {
    return ADMIN_ROLES;
  }

  if (CREATOR_PATH_PREFIXES.some((path) => isPathMatch(pathname, path))) {
    return CREATOR_STUDIO_ROLES;
  }

  if (TAKE_TEST_PATH_PATTERN.test(pathname)) {
    return AUTHENTICATED_ROLES;
  }

  if (AUTHENTICATED_PATH_PREFIXES.some((path) => isPathMatch(pathname, path))) {
    return AUTHENTICATED_ROLES;
  }

  return null;
}

export function canRoleAccess(role: Role | null, allowedRoles: readonly Role[]) {
  return Boolean(role && allowedRoles.includes(role));
}

export function canAccessPath(session: AuthSession, pathname: string) {
  if (isGuestOnlyPath(pathname)) {
    return !session.isAuthenticated;
  }

  const requiredRoles = getRequiredRoles(pathname);
  if (!requiredRoles) return true;

  return session.isAuthenticated && canRoleAccess(session.role, requiredRoles);
}

export function getPostLoginRedirect(role: Role | null) {
  if (role === "ADMIN") return "/admin";
  if (role === "TEACHER") return "/creator-studio";
  return "/profile";
}
