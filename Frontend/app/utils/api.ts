import axios, { AxiosInstance, AxiosError } from 'axios';
import Cookies from 'js-cookie';

const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // En el cliente, usar la URL del servidor de desarrollo o producción
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
  }
  // En el servidor (SSR)
  return process.env.API_BASE_URL || 'http://localhost:8000/api';
};

const API_BASE_URL = getApiBaseUrl();

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && originalRequest && !(originalRequest as any)._retry) {
      (originalRequest as any)._retry = true;
      
      try {
        const refreshToken = Cookies.get('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          Cookies.set('access_token', access, { expires: 1/24 }); // 1 hour
          
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access}`;
          }
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export const healthCheck = async () => {
  try {
    const response = await apiClient.get('/healthcheck/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBackendHealth = async () => {
  const startTime = performance.now();
  try {
    const response = await axios.get(`${API_BASE_URL}/healthcheck/`);
    const endTime = performance.now();
    return {
      ...response.data,
      responseTime: Math.round(endTime - startTime)
    };
  } catch (error) {
    const endTime = performance.now();
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime: Math.round(endTime - startTime)
    };
  }
};
