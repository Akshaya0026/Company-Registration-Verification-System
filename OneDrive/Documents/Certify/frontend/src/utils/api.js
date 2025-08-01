import axios from 'axios';

const API_URL = 'http://localhost:3001/api'; // Updated to match new server port

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('API interceptor - token from localStorage:', token ? 'Token exists' : 'No token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Added Authorization header to request');
    }
    return config;
  },
  (error) => {
    console.error('API request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common response issues
api.interceptors.response.use(
  (response) => {
    console.log(`API response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error('API response error:', error.message);
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const login = (credentials) => {
  console.log('Calling login API with:', { ...credentials, password: '***' });
  return api.post('/auth/login', credentials)
    .then(response => {
      console.log('Login API response:', response);
      return response;
    })
    .catch(error => {
      console.error('Login API error:', error);
      throw error;
    });
};

export const signup = (userData) => {
  console.log('Calling signup API with:', { ...userData, password: '***' });
  return api.post('/auth/signup', userData)
    .then(response => {
      console.log('Signup API response:', response);
      return response;
    })
    .catch(error => {
      console.error('Signup API error:', error);
      throw error;
    });
};

export const updateProfile = (userData) => {
  console.log('Calling update profile API with:', { ...userData });
  return api.put('/auth/profile', userData)
    .then(response => {
      console.log('Update profile API response:', response);
      return response;
    })
    .catch(error => {
      console.error('Update profile API error:', error);
      throw error;
    });
};

export const updatePassword = (passwordData) => {
  console.log('Calling update password API with:', { ...passwordData, currentPassword: '***', newPassword: '***' });
  return api.put('/auth/password', passwordData)
    .then(response => {
      console.log('Update password API response:', response);
      return response;
    })
    .catch(error => {
      console.error('Update password API error:', error);
      throw error;
    });
};

// Certificate API calls
export const getCertificates = () => api.get('/certs');
export const getCertificate = (id) => api.get(`/certs/${id}`);
export const addCertificate = (certData) => api.post('/certs', certData);
export const updateCertificate = (id, certData) => api.put(`/certs/${id}`, certData);
export const deleteCertificate = (id) => api.delete(`/certs/${id}`);
export const importCertificates = (certificates) => api.post('/certs/import', { certificates });

// PDF Upload API calls
export const uploadPdf = (certId, formData) => {
  console.log('Uploading PDF for certificate:', certId);
  return api.post(`/uploads/${certId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const getPdf = (certId) => {
  console.log('Getting PDF for certificate:', certId);
  return api.get(`/uploads/${certId}`, { responseType: 'blob' });
};

export default api;