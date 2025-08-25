import axios from 'axios';
import queryString from 'query-string';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const AUTH_KEY = 'Auth_Data';

const getAccessToken = () => {
    const res = localStorage.getItem(AUTH_KEY);
    return res ? JSON.parse(res).token : '';
};

const axiosClient = axios.create({
    baseURL,
    paramsSerializer: (params) => queryString.stringify(params)
});

axiosClient.interceptors.request.use((config) => {
    const accessToken = getAccessToken();

    config.headers = {
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
        Accept: 'application/json',
        ...config.headers
    };

    return { ...config, data: config.data ?? null };
});

axiosClient.interceptors.response.use(
    (res) => {
        if (res.data && res.status >= 200 && res.status < 300) {
            return res.data;
        } else {
            return Promise.reject(res.data);
        }
    },
    (error) => {
        const { response } = error;
        return Promise.reject(response?.data || { message: error.message });
    }
);

export default axiosClient;
