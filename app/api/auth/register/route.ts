import { NextResponse } from "next/server";
import {
  applyAuthCookies,
  getBackendAuthUrl,
  getResponseMessage,
  jsonError,
  normalizeBackendAuthResponse,
  type BackendAuthResponse,
} from "../_lib/session";

export async function POST(request: Request) {
  const payload = await request.json();

  const backendResponse = await fetch(getBackendAuthUrl("/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = (await backendResponse.json().catch(() => null)) as BackendAuthResponse | { message?: string } | null;

  if (!backendResponse.ok) {
    return jsonError(getResponseMessage(data) ?? "Registration failed.", backendResponse.status);
  }

  try {
    const auth = normalizeBackendAuthResponse(data as BackendAuthResponse);
    const response = NextResponse.json({
      accessToken: auth.accessToken,
      user: auth.user,
    });

    await applyAuthCookies(response, auth.refreshToken, auth.user.role);
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid auth response.";
    return jsonError(message, 502);
  }
}
