import api from "@/api/axios";
import {
  type RegisterResponse,
  type LoginResponse,
  type RegisterRequest,
  type LoginRequest,
  type RefreshTokenResponse,
  type User,
} from "../types/auth.types";

export const AuthApi = {
  register: async (payload: RegisterRequest) => {
    const { data } = await api.post<RegisterResponse>(
      "/auth/register",
      payload,
    );

    return data;
  },

  login: async (payload: LoginRequest) => {
    const { data } = await api.post<LoginResponse>("/auth/login", payload);

    return data;
  },

  refreshToken: async (refreshToken: string) => {
    const { data } = await api.post<RefreshTokenResponse>("/auth/refresh", {
      refreshToken,
    });

    return data;
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Ignore network errors on logout call
    }
  },

  getCurrentUser: async (): Promise<User | null> => {
    try {
      const { data } = await api.get<{ success?: boolean; data?: User; user?: User }>("/auth/me");
      return data.data || data.user || null;
    } catch {
      return null;
    }
  },
};

