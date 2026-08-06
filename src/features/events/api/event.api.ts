import api from "@/api/axios";

export const getEvents = async (params?: Record<string, any>) => {
  const response = await api.get("/events", { params });
  return response.data?.data || { events: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } };
};

export const getEvent = async (id: string) => {
  const response = await api.get(`/events/${id}`);
  return response.data?.data || null;
};

export const createEvent = async (data: any) => {
  const response = await api.post("/events", data);
  return response.data;
};

export const updateEvent = async (id: string, data: any) => {
  const response = await api.patch(`/events/${id}`, data);
  return response.data;
};

export const deleteEvent = async (id: string) => {
  const response = await api.delete(`/events/${id}`);
  return response.data;
};

export const getCalendar = async (params: { view: string; date?: string; month?: number; year?: number }) => {
  const response = await api.get("/events/calendar", { params });
  return response.data?.data || null;
};
