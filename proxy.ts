import { NextResponse, type NextRequest } from "next/server";
import {
  AUTH_COOKIE_NAME,
  canRoleAccess,
  getRequiredRoles,
  getPostLoginRedirect,
  isGuestOnlyPath,
} from "@/features/auth/auth.rbac";
import {
  SIGNED_ROLE_COOKIE_NAME,
  verifySignedRoleValue,
} from "@/features/auth/auth.signed-role";

function isAuthenticated(request: NextRequest) {
  return Boolean(request.cookies.get(AUTH_COOKIE_NAME)?.value);
}

function getSafeNextPath(pathname: string) {
  return encodeURIComponent(pathname);
}

export async function proxy(request: NextRequest) {
  const { nextUrl } = request;
  const hasSession = isAuthenticated(request);
  const role = await verifySignedRoleValue(
    request.cookies.get(SIGNED_ROLE_COOKIE_NAME)?.value,
  );

  if (isGuestOnlyPath(nextUrl.pathname) && hasSession) {
    return NextResponse.redirect(new URL(getPostLoginRedirect(role), request.url));
  }

  const requiredRoles = getRequiredRoles(nextUrl.pathname);
  if (!requiredRoles) {
    return NextResponse.next();
  }

  if (!hasSession || !role) {
    return NextResponse.redirect(
      new URL(`/login?next=${getSafeNextPath(nextUrl.pathname)}`, request.url),
    );
  }

  if (!canRoleAccess(role, requiredRoles)) {
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
    "/admin/:path*",
  ],
};
