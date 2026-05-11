import { NextResponse } from "next/server";
import { clearAuthCookies, getBackendAuthUrl, getBearerToken } from "../_lib/session";

export async function POST(request: Request) {
  const accessToken = getBearerToken(request);

  if (accessToken) {
    await fetch(getBackendAuthUrl("/logout"), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }).catch(() => null);
  }

  const response = NextResponse.json({ ok: true });
  clearAuthCookies(response);
  return response;
}
