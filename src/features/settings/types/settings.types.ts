export interface UserProfile {
  _id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone?: string;
  avatarId?: string;
  currency?: string;
  country?: string;
  city?: string;
  state?: string;
  pincode?: string;
  subscription: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfilePayload {
  businessName?: string;
  ownerName?: string;
  phone?: string;
  avatarId?: string;
  currency?: string;
  country?: string;
  city?: string;
  state?: string;
  pincode?: string;
}
