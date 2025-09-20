import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
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

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/register', userData),
  login: (credentials) => api.post('/login', credentials),
  getMe: () => api.get('/me'),
};

// Candidates API calls
export const candidatesAPI = {
  getCandidates: () => api.get('/candidates'),
  createCandidate: (candidateData) => api.post('/candidates', candidateData),
  getCandidateById: (id) => api.get(`/candidates/${id}`),
  deleteCandidate: (id) => api.delete(`/candidates/${id}`),
  voteForCandidate: (id) => api.post(`/candidates/${id}/vote`),
};

export default api;
