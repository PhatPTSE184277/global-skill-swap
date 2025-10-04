import axios from 'axios';
// Sử dụng relative path để tận dụng Vite proxy
const baseUrl = import.meta.env.DEV ? '/api' : (import.meta.env.VITE_ROOM_API_URL || 'https://gss-room-service.onrender.com/api');

const config = {
     baseURL: baseUrl
};

const api = axios.create(config);

const handleBefore = (config) => {
    const authData = localStorage.getItem('authData');
    let token = null;
    if (authData) {
        try {
            token = JSON.parse(authData).token;
        } catch {
            token = null;
        }
    }

    if (token) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
};

const handleRequestError = (error) => Promise.reject(error);

api.interceptors.request.use(handleBefore, handleRequestError);

export default api;
