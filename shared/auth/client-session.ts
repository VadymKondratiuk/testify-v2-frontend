"use client";

import {
  AUTH_COOKIE_NAME,
  ROLE_COOKIE_NAME,
  type AuthSession,
  type Role,
  normalizeRole,
} from "@/shared/auth/rbac";

export const AUTH_SESSION_EVENT = "testify-auth-session-change";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function readCookie(name: string) {
  const match = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${name}=`));

  return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : null;
}

function writeCookie(name: string, value: string, maxAgeSeconds: number) {
  document.cookie = [
    `${name}=${encodeURIComponent(value)}`,
    "path=/",
    `max-age=${maxAgeSeconds}`,
    "samesite=lax",
  ].join("; ");
}

function notifySessionChange() {
  window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
}

export function getClientSession(): AuthSession {
  const role = normalizeRole(readCookie(ROLE_COOKIE_NAME));
  const sessionToken = readCookie(AUTH_COOKIE_NAME);

  return {
    isAuthenticated: Boolean(sessionToken && role),
    role,
  };
}

export function setClientSession(role: Role) {
  writeCookie(AUTH_COOKIE_NAME, `mock-session-${role.toLowerCase()}`, SESSION_MAX_AGE_SECONDS);
  writeCookie(ROLE_COOKIE_NAME, role, SESSION_MAX_AGE_SECONDS);
  notifySessionChange();
}

export function clearClientSession() {
  writeCookie(AUTH_COOKIE_NAME, "", 0);
  writeCookie(ROLE_COOKIE_NAME, "", 0);
  notifySessionChange();
}

