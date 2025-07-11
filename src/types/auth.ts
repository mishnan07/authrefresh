export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  code: number;
  success: boolean;
  status: string;
  message: string;
  accessToken: string;
  refreshToken: string;
  unique_id: string;
  email: string;
  phone: string;
  userId: string;
  name: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface User {
  unique_id: string;
  email: string;
  phone: string;
  userId: string;
  name: string;
}