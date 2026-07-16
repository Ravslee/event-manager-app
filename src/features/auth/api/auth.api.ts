import api from "@/api/axios";
import {
  type RegisterResponse,
  type LoginResponse,
  type RegisterRequest,
  type LoginRequest,
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
};
