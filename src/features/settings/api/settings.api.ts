import api from "@/api/axios";
import type { UserProfile, UpdateProfilePayload } from "../types/settings.types";

export const getMyProfile = async (): Promise<UserProfile> => {
  const response = await api.get("/users/me");
  return response.data?.data;
};

export const updateMyProfile = async (data: UpdateProfilePayload): Promise<UserProfile> => {
  const response = await api.put("/users/me", data);
  return response.data?.data;
};

export const changeMyPassword = async (data: any) => {
  const response = await api.put("/users/me/password", data);
  return response.data?.data;
};
