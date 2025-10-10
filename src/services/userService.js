import axiosClient from '../apis/axiosClient';

const userService = {
    getCurrentUser: async () => {
        const response = await axiosClient.get('/user/me');
        return response?.data;
    }
};

export default userService;