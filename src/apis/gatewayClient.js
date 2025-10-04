import axios from 'axios';

const baseUrl = import.meta.env.DEV ? '/api' : (import.meta.env.VITE_GATEWAY_API_URL || 'https://gateway-service-w2gi.onrender.com/api');

const gatewayApi = axios.create({
    baseURL: baseUrl
});

const handleBefore = (config) => {
    const authData = localStorage.getItem('authData');
    let token = null;
    if (authData) {
        try {
            token = JSON.parse(authData).token;
        } catch (error) {
            // Silent fail
        }
    }
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};

const handleError = (error) => {
    return Promise.reject(error);
};

gatewayApi.interceptors.request.use(handleBefore, handleError);
gatewayApi.interceptors.response.use((response) => response, handleError);

export default gatewayApi;