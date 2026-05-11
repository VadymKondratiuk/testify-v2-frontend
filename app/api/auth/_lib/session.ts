import { NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  LEGACY_ROLE_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  SIGNED_ROLE_COOKIE_NAME,
  normalizeRole,
} from "@/features/auth/auth.rbac";
import { createSignedRoleValue } from "@/features/auth/auth.signed-role";
import type { AuthUser } from "@/features/auth/auth.service";

const REFRESH_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export type BackendAuthResponse = {
  accessToken?: string;
  access_token?: string;
  refreshToken?: string;
  refresh_token?: string;
  user?: Partial<AuthUser>;
};

export type NormalizedAuthResponse = {
  accessToken: string;
  refreshToken?: string;
  user: AuthUser;
};

function getBackendBaseUrl() {
  return (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000").replace(/\/$/, "");
}

export function getBackendAuthUrl(path: "/register" | "/login" | "/logout" | "/refresh") {
  return `${getBackendBaseUrl()}/auth${path}`;
}

export function getBearerToken(request: Request) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.toLowerCase().startsWith("bearer ")) return null;

  return authorization.slice("bearer ".length).trim();
}

function decodeBase64Url(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");

  return Buffer.from(padded, "base64").toString("utf8");
}

function decodeJwtPayload(token: string) {
  const [, payload] = token.split(".");
  if (!payload) return null;

  try {
    return JSON.parse(decodeBase64Url(payload)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function readString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function userFromToken(accessToken: string): AuthUser {
  const payload = decodeJwtPayload(accessToken);
  const role = normalizeRole(readString(payload?.role) || readString(payload?.roles));

  return {
    id: readString(payload?.sub) || readString(payload?.id) || readString(payload?.userId),
    name: readString(payload?.name) || readString(payload?.fullName) || readString(payload?.email),
    email: readString(payload?.email),
    role: role ?? "STUDENT",
  };
}

export function normalizeBackendAuthResponse(data: BackendAuthResponse): NormalizedAuthResponse {
  const accessToken = data.accessToken ?? data.access_token;
  const refreshToken = data.refreshToken ?? data.refresh_token;

  if (!accessToken) {
    throw new Error("Backend did not return an access token.");
  }

  const tokenUser = userFromToken(accessToken);
  const role = normalizeRole(data.user?.role) ?? tokenUser.role;

  return {
    accessToken,
    refreshToken,
    user: {
      id: data.user?.id ?? tokenUser.id,
      name: data.user?.name ?? tokenUser.name,
      email: data.user?.email ?? tokenUser.email,
      role,
    },
  };
}

export async function applyAuthCookies(response: NextResponse, refreshToken: string | undefined, role: AuthUser["role"]) {
  const secure = process.env.NODE_ENV === "production";

  if (refreshToken) {
    response.cookies.set(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: REFRESH_MAX_AGE_SECONDS,
    });
  }

  response.cookies.set(AUTH_COOKIE_NAME, "1", {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  response.cookies.set(SIGNED_ROLE_COOKIE_NAME, await createSignedRoleValue(role), {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export function clearAuthCookies(response: NextResponse) {
  for (const name of [REFRESH_COOKIE_NAME, AUTH_COOKIE_NAME, SIGNED_ROLE_COOKIE_NAME, LEGACY_ROLE_COOKIE_NAME]) {
    response.cookies.set(name, "", {
      path: "/",
      maxAge: 0,
    });
  }
}

export function getResponseMessage(data: unknown) {
  if (typeof data !== "object" || data === null || !("message" in data)) {
    return null;
  }

  const message = (data as { message: unknown }).message;
  return typeof message === "string" ? message : null;
}

export function jsonError(message: string, status: number) {
  return NextResponse.json({ message }, { status });
}
