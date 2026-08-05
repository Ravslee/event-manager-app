export interface EventType {
  _id: string;
  userId: string;
  name: string;
  color: string;
  description?: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type EventTypeFormInput = {
  name: string;
  color: string;
  description: string;
  isDefault: boolean;
  isActive: boolean;
};
