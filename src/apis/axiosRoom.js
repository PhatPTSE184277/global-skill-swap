import axios from 'axios';

const baseUrl = import.meta.env.PROD
    ? import.meta.env.VITE_ROOM_SERVICE_URL + '/api'
    : '/api/room';

const apiRoom = axios.create({
    baseURL: baseUrl
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

apiRoom.interceptors.request.use(handleBefore, handleRequestError);

export default apiRoom;