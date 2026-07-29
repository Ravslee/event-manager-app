import api from "@/api/axios";
import type { ServiceFormModel } from "../schemas/service.schema";

export const getServices = async () => {
  const response = await api.get("/services");
  const list = response.data?.data?.services || [];
  return list.filter((s: any) => s.isActive !== false);
};

export const getService = async (id: string) => {
  const response = await api.get(`/services/${id}`);
  return response.data?.data?.service || null;
};

export const createService = async (data: ServiceFormModel) => {
  const response = await api.post("/services", data);
  return response.data;
};

export const updateService = async (id: string, data: Partial<ServiceFormModel>) => {
  const response = await api.patch(`/services/${id}`, data);
  return response.data;
};

export const deleteService = async (id: string) => {
  const response = await api.delete(`/services/${id}`);
  return response.data;
};
