import axios, { type InternalAxiosRequestConfig } from "axios";
import { clearClientSession, notifySessionChange } from "@/features/auth/auth.client-session";
import { getAccessToken, setAccessToken } from "@/features/auth/auth.tokens";
import { useAuthStore } from "@/features/auth/auth.store";
import type { AuthResponse } from "@/features/auth/auth.service";

declare module "axios" {
  interface AxiosRequestConfig {
    skipAuthRedirect?: boolean;
  }

  interface InternalAxiosRequestConfig {
    _isRetry?: boolean;
    skipAuthRedirect?: boolean;
  }
}

let refreshPromise: Promise<string | null> | null = null;

type ApiRequestConfig = InternalAxiosRequestConfig;

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as ApiRequestConfig | undefined;
    const isLocalAuthRequest =
      typeof originalRequest?.url === "string" && originalRequest.url.startsWith("/api/auth/");
    const shouldSkipAuthRedirect = originalRequest?.skipAuthRedirect;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._isRetry &&
      !isLocalAuthRequest &&
      !shouldSkipAuthRedirect
    ) {
      originalRequest._isRetry = true;

      try {
        refreshPromise ??= axios
          .post<AuthResponse>("/api/auth/refresh", undefined, { withCredentials: true })
          .then(({ data }) => {
            setAccessToken(data.accessToken);
            useAuthStore.getState().setUser(data.user);
            notifySessionChange();
            return data.accessToken;
          })
          .finally(() => {
            refreshPromise = null;
          });

        const newAccessToken = await refreshPromise;
        if (!newAccessToken) throw new Error("No access token after refresh.");

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        setAccessToken(null);
        clearClientSession();
        useAuthStore.getState().clearAuth();

        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
