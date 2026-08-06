import api from "@/api/axios";
import type { Payment, CreateTransactionPayload } from "../types/payments.types";

export const getPayments = async () => {
  const response = await api.get("/payments");
  return (response.data?.data || []) as Payment[];
};

export const getPendingPayments = async () => {
  const response = await api.get("/payments/pending");
  return (response.data?.data || []) as Payment[];
};

export const getPaymentByEventId = async (eventId: string) => {
  const response = await api.get(`/payments/${eventId}`);
  return (response.data?.data || null) as Payment | null;
};

export const createPaymentTransaction = async (
  eventId: string,
  data: CreateTransactionPayload
) => {
  const response = await api.post(`/payments/${eventId}/transactions`, data);
  return response.data?.data;
};

export const deleteTransaction = async (
  paymentId: string,
  transactionId: string
) => {
  const response = await api.delete(
    `/payments/${paymentId}/transactions/${transactionId}`
  );
  return response.data?.data;
};
