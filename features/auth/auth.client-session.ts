"use client";

import { LEGACY_ROLE_COOKIE_NAME } from "@/features/auth/auth.rbac";

export const AUTH_SESSION_EVENT = "testify-auth-session-change";

function writeCookie(name: string, value: string, maxAgeSeconds: number) {
  if (typeof document === "undefined") return;

  document.cookie = [
    `${name}=${encodeURIComponent(value)}`,
    "path=/",
    `max-age=${maxAgeSeconds}`,
    "samesite=lax",
  ].join("; ");
}

export function notifySessionChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
  }
}

export function clearClientSession() {
  writeCookie(LEGACY_ROLE_COOKIE_NAME, "", 0);
  notifySessionChange();
}
