import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle token expiration
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export const authService = {
    getCurrentUser: async () => {
        const response = await api.get('/auth/current-user');
        return response.data;
    },

    logout: async () => {
        await api.post('/auth/logout');
        localStorage.removeItem('token');
    },
};

export const userService = {
    getProfile: async () => {
        const response = await api.get('/api/users/profile');
        return response.data;
    },

    updateProfile: async (profileData) => {
        const response = await api.put('/api/users/profile', profileData);
        return response.data;
    },

    getParticipants: async (params) => {
        const response = await api.get('/api/users/participants', { params });
        return response.data;
    },

    getUserById: async (userId) => {
        const response = await api.get(`/api/users/${userId}`);
        return response.data;
    },
};

export const selectionService = {
    submitSelection: async (selectedUserId) => {
        const response = await api.post('/api/selections', { selectedUserId });
        return response.data;
    },

    getMySelection: async () => {
        const response = await api.get('/api/selections/my-selection');
        return response.data;
    },

    getRequestCount: async () => {
        const response = await api.get('/api/selections/request-count');
        return response.data;
    },
};

export const matchService = {
    getMatchCount: async () => {
        const response = await api.get('/api/matches/count');
        return response.data;
    },

    getMatches: async () => {
        const response = await api.get('/api/matches');
        return response.data;
    },
};

export const eventService = {
    getCurrentEvent: async () => {
        const response = await api.get('/api/events/current');
        return response.data;
    },
};

export default api;
