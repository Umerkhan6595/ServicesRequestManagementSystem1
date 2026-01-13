import axios from 'axios';

const API_URL = 'https://servicesrequestmanagementsystembackend.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },
  verifyEmail: async (token) => {
    try {
      const cleanToken = token.trim();
      console.log('Frontend - Sending token to API:', cleanToken.substring(0, 20) + '...');
      console.log('Frontend - Token length:', cleanToken.length);
  
      const encodedToken = encodeURIComponent(cleanToken);
      const response = await api.get(`/auth/verify/${encodedToken}`);
      return response.data;
    } catch (error) {
      console.error('Frontend API Error:', error);
      if (error.response) {
        const errorMessage = error.response.data?.message || 'Email verification failed';
        const customError = new Error(errorMessage);
        customError.response = error.response;
        throw customError;
      }
      throw error;
    }
  },
};

export const serviceRequestAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/service-requests');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch service requests');
    }
  },
  create: async (requestData) => {
    try {
      const response = await api.post('/service-requests', requestData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create service request');
    }
  },
  update: async (id, requestData) => {
    try {
      const response = await api.put(`/service-requests/${id}`, requestData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update service request');
    }
  },
  delete: async (id) => {
    try {
      const response = await api.delete(`/service-requests/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete service request');
    }
  },
  getById: async (id) => {
    try {
      const response = await api.get(`/service-requests/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch service request');
    }
  },
};

export default api;

