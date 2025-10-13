import axios from 'axios';
const api = axios.create({
    baseURL: '/api'
});

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