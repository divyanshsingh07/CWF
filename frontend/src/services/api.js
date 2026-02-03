// API Service - Centralized API calls
// Use environment variable in production, fallback to localhost for development
const API_BASE_URL = import.meta.env.PROD
  ? '/api'
  : (import.meta.env.VITE_API_URL || 'http://localhost:4000/api');

// Helper to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Helper for API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    // Handle non-JSON responses
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(text || `HTTP ${response.status}: ${response.statusText}`);
    }

    if (!response.ok) {
      // Handle CORS errors
      if (response.status === 0 || response.type === 'opaque') {
        throw new Error('CORS error: Backend server may not be running or CORS is not configured correctly.');
      }
      throw new Error(data.message || data.error || `API request failed: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    // Enhance error messages for network issues
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the server. Please check your connection and ensure the backend is running.');
    }
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: (userData) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getMe: () => apiCall('/auth/me'),
};

// Courses API
export const coursesAPI = {
  getAll: () => apiCall('/courses'),

  getById: (id) => apiCall(`/courses/${id}`),

  create: (courseData) =>
    apiCall('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    }),

  update: (id, courseData) =>
    apiCall(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    }),

  delete: (id) =>
    apiCall(`/courses/${id}`, {
      method: 'DELETE',
    }),

  // Teacher-specific endpoints
  getMyCreatedCourses: () => apiCall('/courses/my-created-courses'),

  getDashboard: () => apiCall('/courses/dashboard'),
};

// File Upload API
export const uploadAPI = {
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/upload/file`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }
    return data;
  },

  uploadMultiple: async (files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    
    const response = await fetch(`${API_BASE_URL}/upload/multiple`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }
    return data;
  },

  deleteFile: (filename) =>
    apiCall(`/upload/file/${filename}`, {
      method: 'DELETE',
    }),

  // If URL is already absolute (e.g. CloudFront), return as-is; otherwise prepend backend origin (local /uploads/...).
  getFileUrl: (urlOrPath) => {
    if (typeof urlOrPath !== 'string') return urlOrPath;
    if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://')) return urlOrPath;
    const origin = API_BASE_URL.replace(/\/api\/?$/, '');
    return `${origin}${urlOrPath.startsWith('/') ? '' : '/'}${urlOrPath}`;
  },
};

// Course Content API
export const contentAPI = {
  getCourseContent: (courseId) => apiCall(`/content/course/${courseId}`),

  getById: (id) => apiCall(`/content/${id}`),

  create: (contentData) =>
    apiCall('/content', {
      method: 'POST',
      body: JSON.stringify(contentData),
    }),

  update: (id, contentData) =>
    apiCall(`/content/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contentData),
    }),

  delete: (id) =>
    apiCall(`/content/${id}`, {
      method: 'DELETE',
    }),
};

// Subscription API
export const subscriptionAPI = {
  subscribe: (courseId, promoCode) =>
    apiCall('/subscribe', {
      method: 'POST',
      body: JSON.stringify({ courseId, promoCode }),
    }),

  getMyCourses: () => apiCall('/subscribe/my-courses'),

  checkSubscription: (courseId) => apiCall(`/subscribe/check/${courseId}`),

  // Remove free course subscription (only allowed for free courses)
  removeSubscription: (subscriptionId) =>
    apiCall(`/subscribe/${subscriptionId}`, {
      method: 'DELETE',
    }),

  validatePromo: (promoCode) =>
    apiCall('/subscribe/validate-promo', {
      method: 'POST',
      body: JSON.stringify({ promoCode }),
    }),
};

export default {
  auth: authAPI,
  courses: coursesAPI,
  subscription: subscriptionAPI,
};