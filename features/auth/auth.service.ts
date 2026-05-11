import axios from "axios";
import { clearClientSession, notifySessionChange } from "@/features/auth/auth.client-session";
import { getAccessToken, setAccessToken } from "@/features/auth/auth.tokens";
import type { Role } from "@/features/auth/auth.rbac";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

function rememberAuth(data: AuthResponse) {
  setAccessToken(data.accessToken);
  notifySessionChange();
  return data;
}

export const AuthService = {
  async register(data: RegisterPayload): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>("/api/auth/register", data);

    return rememberAuth(response.data);
  },

  async login(data: LoginPayload): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>("/api/auth/login", data);

    return rememberAuth(response.data);
  },

  async refresh(): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>("/api/auth/refresh");

    return rememberAuth(response.data);
  },

  async logout() {
    const token = getAccessToken();

    await axios
      .post(
        "/api/auth/logout",
        undefined,
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
      )
      .catch(() => null);

    setAccessToken(null);
    clearClientSession();
  },
};
