import api from "@/api/axios";
import type { EventTypeFormInput } from "../types/event-type.types";

export const getEventTypes = async () => {
  const response = await api.get("/event-types");
  return response.data?.data?.eventTypes || [];
};

export const getEventType = async (id: string) => {
  const response = await api.get(`/event-types/${id}`);
  return response.data?.data?.eventType || null;
};

export const createEventType = async (data: EventTypeFormInput) => {
  const response = await api.post("/event-types", data);
  return response.data;
};

export const updateEventType = async (id: string, data: Partial<EventTypeFormInput>) => {
  const response = await api.patch(`/event-types/${id}`, data);
  return response.data;
};

export const deleteEventType = async (id: string) => {
  const response = await api.delete(`/event-types/${id}`);
  return response.data;
};
