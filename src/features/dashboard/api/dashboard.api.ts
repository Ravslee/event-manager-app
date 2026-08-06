import api from "@/api/axios";
import type { DashboardData } from "../types/dashboard.types";

export const getDashboardData = async (): Promise<DashboardData> => {
  const response = await api.get("/dashboard");
  return response.data;
};
