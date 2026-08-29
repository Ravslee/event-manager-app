export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name?: string;
  ownerName?: string;
  businessName?: string;
  email: string;
  role?: string;
  phone?: string;
  avatar?: string;
}

export interface LoginResponse {
  success?: boolean;
  message?: string;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  data?: {
    token?: string;
    accessToken?: string;
    refreshToken?: string;
    user: User;
  };
  user?: User;
}

export interface RegisterRequest {
  businessName: string;
  ownerName: string;
  email: string;
  password: string;
  phone: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token?: string;
    accessToken?: string;
    refreshToken?: string;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  message?: string;
  accessToken: string;
  refreshToken?: string;
  token?: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
    token?: string;
  };
}

