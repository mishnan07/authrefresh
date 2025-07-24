import axios from 'axios';
import Cookies from 'js-cookie';
import { LoginRequest, LoginResponse, RefreshTokenRequest, User } from '@/types/auth';

const API_BASE_URL = 'https://apigateway.seclob.com/v1/user-no/auth';

// Create axios instance
export const apiClient = axios.create();

// Add request interceptor to include access token
apiClient.interceptors.request.use((config) => {
  const token = tokenManager.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log(error.response?.status,'error.response?.status',error.response);
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = tokenManager.getRefreshToken();
      if (refreshToken) {
        try {
          const response = await authService.refreshToken(refreshToken);
          tokenManager.setTokens(response.accessToken, response.refreshToken);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          tokenManager.clearTokens();
          tokenManager.clearUser();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await axios.post(`${API_BASE_URL}/login-test`, credentials);
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const response = await axios.post(`${API_BASE_URL}/refresh-token-test`, {
      refreshToken
    });
    return response.data;
  },

  async logout(refreshToken: string): Promise<void> {
    await apiClient.post(`${API_BASE_URL}/logout`, {
      refreshToken
    });
  }
};

export const tokenManager = {
  setTokens(accessToken: string, refreshToken: string) {
    Cookies.set('accessToken', accessToken, { expires: 1 });
    Cookies.set('refreshToken', refreshToken, { expires: 7 });
  },

  getAccessToken(): string | undefined {
    return Cookies.get('accessToken');
  },

  getRefreshToken(): string | undefined {
    return Cookies.get('refreshToken');
  },

  clearTokens() {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
  },

  setUser(user: User) {
    Cookies.set('user', JSON.stringify(user), { expires: 7 });
  },

  getUser(): User | null {
    const userStr = Cookies.get('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  clearUser() {
    Cookies.remove('user');
  }
};