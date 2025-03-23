import axios from 'axios';
import { getToken, removeToken, setToken, getUserFromToken } from '@/utils/tokenUtils';
import { refreshAccessToken } from './authService';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

apiClient.interceptors.request.use(
  async (config) => {
    const token = getToken();
    const user = getUserFromToken();
    console.log('Request URL:', config.url);
    console.log('Token present:', !!token);
    console.log('User ID:', user?.userId);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.error('Response error:', {
      status: error.response?.status,
      url: error.config?.url,
      headers: error.config?.headers,
    });
    
    const originalRequest = error.config;

    // List of auth endpoints to exclude from refresh token logic
    const authEndpoints = [
      '/auth/login',
      '/auth/register',
      '/auth/refresh-token',
    ];

    // Check if the request is to an auth endpoint
    if (
      authEndpoints.some((endpoint) => originalRequest.url.includes(endpoint))
    ) {
      return Promise.reject(error);
    }

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      console.log('Token expired, attempting to refresh...');
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = 'Bearer ' + token;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise(function (resolve, reject) {
        refreshAccessToken()
          .then(({ accessToken }) => {
            console.log('Token refreshed successfully');
            setToken(accessToken);
            apiClient.defaults.headers.common['Authorization'] =
              'Bearer ' + accessToken;
            originalRequest.headers.Authorization = 'Bearer ' + accessToken;
            processQueue(null, accessToken);
            resolve(apiClient(originalRequest));
          })
          .catch((err) => {
            console.error('Failed to refresh token:', err);
            processQueue(err, null);
            removeToken();
            window.location.href = '/login';
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  }
);

export default apiClient;
