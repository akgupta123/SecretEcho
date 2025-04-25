import axios from  "axios";
const API_URL = process.env.NEXT_BACKEND_API_URL
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            return Promise.reject(new Error('Unauthorized! Redirecting to login...'));
        }
        return Promise.reject(error);
    }
);


export const authAPI = {
    register: (userData) => api.post('/auth/user/signup', userData),
    login: (credentials) => api.post('auth/user/login', credentials),
   // getCurrentUser: () => api.get('/auth/me'),
};

export const messagesAPI = {
    getMessages: (page = 1, limit = 50) =>
        api.get(`/messages?page=${page}&limit=${limit}`),
    sendMessage: (content) => api.post('/messages', { content }),
    markAsRead: () => api.put('/messages/read'),
};

export default api;