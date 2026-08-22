import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  withCredentials: true, // Crucial for sending/receiving HTTP-Only cookies across endpoints
});

// Flag to prevent infinite retry loops if refresh fails
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

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Force logout on 403 Forbidden (e.g. suspended user or unauthorized admin access)
    if (error.response?.status === 403) {
      const isAdminPage = window.location.pathname.startsWith('/admin');
      window.location.href = isAdminPage ? '/admin/login?error=suspended' : '/login?error=suspended';
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return axiosInstance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post('/api/v1/auth/refresh-token', {}, { withCredentials: true });
        
        isRefreshing = false;
        processQueue(null);
        
        return axiosInstance(originalRequest);
      } catch (err) {
        isRefreshing = false;
        processQueue(err, null);
        
        // If refresh token fails, redirect to login (unless we were just checking profile)
        if (!originalRequest.url.includes('/auth/profile') && window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
