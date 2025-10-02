import axiosClient from '../apis/axiosClient';

const authService = {
    login: async (credentials) => {
        const response = await axiosClient.post('/authentication/login', {
            username: credentials.usernameOrEmail,
            password: credentials.password
        });
        return response;
    },
    register: async (data) => {
        const response = await axiosClient.post('/authentication/register', {
            username: data.username,
            email: data.email,
            password: data.password
        });
        return response;
    },
    forgotPassword: async (email) => {
        const response = await axiosClient.post(
            '/authentication/forgot-password',
            { email }
        );
        return response;
    },
    resetPassword: async (userId, token) => {
        const response = await axiosClient.post(
            '/authentication/reset-password',
            token,
            {
                headers: {
                    'X-User-ID': userId
                }
            }
        );
        return response;
    }
};

export default authService;
