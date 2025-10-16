import axios from 'axios';
const baseUrl = import.meta.env.VITE_ROOM_API_URL;

const config = {
     baseURL: baseUrl
};

const apiRoom = axios.create(config);

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
