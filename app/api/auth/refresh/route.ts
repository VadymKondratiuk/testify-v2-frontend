import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { REFRESH_COOKIE_NAME } from "@/features/auth/auth.rbac";
import {
  applyAuthCookies,
  clearAuthCookies,
  getBackendAuthUrl,
  getResponseMessage,
  jsonError,
  normalizeBackendAuthResponse,
  type BackendAuthResponse,
} from "../_lib/session";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value;

  if (!refreshToken) {
    const response = jsonError("No refresh session.", 401);
    clearAuthCookies(response);
    return response;
  }

  const backendResponse = await fetch(getBackendAuthUrl("/refresh"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${refreshToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
  });

  const data = (await backendResponse.json().catch(() => null)) as BackendAuthResponse | { message?: string } | null;

  if (!backendResponse.ok) {
    const response = jsonError(getResponseMessage(data) ?? "Session expired.", backendResponse.status);
    clearAuthCookies(response);
    return response;
  }

  try {
    const auth = normalizeBackendAuthResponse(data as BackendAuthResponse);
    const response = NextResponse.json({
      accessToken: auth.accessToken,
      user: auth.user,
    });

    await applyAuthCookies(response, auth.refreshToken ?? refreshToken, auth.user.role);
    return response;
  } catch (error) {
    const response = jsonError(error instanceof Error ? error.message : "Invalid auth response.", 502);
    clearAuthCookies(response);
    return response;
  }
}
