import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api/v1';

// ==============================================================
// 1. PUBLIC AXIOS INSTANCE (No Auth Headers, No 401 Retry Loops)
// ==============================================================
// Ideal for: Login, Register, Public Stats, and Refresh-Token calls
export const axiosPublic = axios.create({
  baseURL,
  timeout: 15000, // 15 seconds global request timeout
  withCredentials: true, // Send/receive cookies across endpoints
});

// ==============================================================
// 2. PRIVATE AXIOS INSTANCE (Protected, Auto-JWT & Auto-Refresh)
// ==============================================================
// Ideal for: User Profile, Dashboard, Requests, Donations, Settings
export const axiosPrivate = axios.create({
  baseURL,
  timeout: 15000,
  withCredentials: true,
});

// --------------------------------------------------------------
// 🔒 Private Request Interceptor (Injects JWT Access Token)
// --------------------------------------------------------------
axiosPrivate.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --------------------------------------------------------------
// 🔄 Private Response Interceptor (Handles Timeouts, 403, and 401 Refresh)
// --------------------------------------------------------------
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 1. Gracefully handle AbortController / Cancellation
    if (axios.isCancel(error) || error.code === 'ERR_CANCELED' || error.name === 'CanceledError') {
      return Promise.reject({ ...error, isCanceled: true, message: 'Request was cancelled by user.' });
    }

    // 2. Handle Request Timeout explicitly (ECONNABORTED)
    if (error.code === 'ECONNABORTED' || error.message?.toLowerCase().includes('timeout')) {
      console.warn('⏱️ [Network Timeout]: Request took longer than 15s to complete.');
      return Promise.reject({
        ...error,
        isTimeout: true,
        message: 'Request timed out (server took longer than 15s to respond). Please try again.'
      });
    }

    const originalRequest = error.config;

    // 3. Force logout on 403 Forbidden (e.g. suspended user or unverified access)
    if (error.response?.status === 403) {
      const message = error.response?.data?.message || '';
      const isAdminPage = window.location.pathname.startsWith('/admin');
      
      if (message.toLowerCase().includes('verified') || message.toLowerCase().includes('verify')) {
        window.location.href = '/login?error=unverified';
      } else {
        window.location.href = isAdminPage ? '/admin/login?error=suspended' : '/login?error=suspended';
      }
      return Promise.reject(error);
    }

    // 4. Handle 401 Unauthorized via Silent Refresh Queue
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (token) {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
          }
          return axiosPrivate(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const storedRefreshToken = localStorage.getItem("refreshToken");

        // ⚠️ CRITICAL: Use axiosPublic so the refresh request never triggers private interceptors
        const refreshResponse = await axiosPublic.post(
          `/auth/refresh-token`,
          { refreshToken: storedRefreshToken }
        );
        
        const newAccessToken = refreshResponse.data?.data?.accessToken;
        if (newAccessToken) {
          localStorage.setItem("accessToken", newAccessToken);
          axiosPrivate.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        }

        isRefreshing = false;
        processQueue(null, newAccessToken);
        
        return axiosPrivate(originalRequest);
      } catch (err) {
        isRefreshing = false;
        processQueue(err, null);
        
        // Clear local storage tokens on authentication failure
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        // If refresh token fails, redirect to login
        if (!originalRequest.url?.includes('/auth/profile') && window.location.pathname !== '/login') {
          const isAdmin = window.location.pathname.startsWith('/admin');
          window.location.href = isAdmin ? '/admin/login' : '/login';
        }
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

// Export both named instances and default as axiosPrivate for backward compatibility
export const axiosInstance = axiosPrivate;
export default axiosPrivate;
