export interface Transaction {
  _id: string;
  amount: number;
  paymentMethod: string;
  transactionDate: string;
  referenceNumber?: string;
  notes?: string;
}

export interface Payment {
  _id: string;
  userId: string;
  eventId: {
    _id: string;
    title: string;
    client: {
      name: string;
      phone: string;
      email: string;
    };
    eventDate: string;
    startTime: string;
    endTime?: string;
    venue?: {
      name: string;
      address: string;
      mapLink?: string;
    };
    bookedServices?: Array<{
      serviceId: string;
      name: string;
      price: number;
      unit: number;
    }>;
    status: string;
    notes?: string;
  };
  totalAmount: number;
  paidAmount: number;
  status: "Pending" | "Partial" | "Paid" | "Refunded";
  transactions: Transaction[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionPayload {
  amount: number;
  paymentMethod: string;
  referenceNumber?: string;
  notes?: string;
}
