import { NextResponse, type NextRequest } from "next/server";
import {
  AUTH_COOKIE_NAME,
  ROLE_COOKIE_NAME,
  canRoleAccess,
  getPostLoginRedirect,
  getRequiredRoles,
  isGuestOnlyPath,
  normalizeRole,
} from "@/shared/auth/rbac";

function getSession(request: NextRequest) {
  const role = normalizeRole(request.cookies.get(ROLE_COOKIE_NAME)?.value);
  const sessionToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  return {
    isAuthenticated: Boolean(sessionToken && role),
    role,
  };
}

function getSafeNextPath(pathname: string) {
  return encodeURIComponent(pathname);
}

export function proxy(request: NextRequest) {
  const { nextUrl } = request;
  const session = getSession(request);

  if (isGuestOnlyPath(nextUrl.pathname) && session.isAuthenticated) {
    return NextResponse.redirect(new URL(getPostLoginRedirect(session.role), request.url));
  }

  const requiredRoles = getRequiredRoles(nextUrl.pathname);
  if (!requiredRoles) {
    return NextResponse.next();
  }

  if (!session.isAuthenticated) {
    return NextResponse.redirect(
      new URL(`/login?next=${getSafeNextPath(nextUrl.pathname)}`, request.url),
    );
  }

  if (!canRoleAccess(session.role, requiredRoles)) {
    return NextResponse.redirect(
      new URL(`/forbidden?from=${getSafeNextPath(nextUrl.pathname)}`, request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/profile/:path*",
    "/settings/:path*",
    "/history/:path*",
    "/results/:path*",
    "/tests/:id/take/:path*",
    "/creator-studio/:path*",
  ],
};

