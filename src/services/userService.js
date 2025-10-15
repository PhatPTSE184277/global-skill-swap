import axiosClient from '../apis/axiosClient';

const userService = {
    getCurrentUser: async () => {
        const response = await axiosClient.get('/user/me');
        return response?.data;
    },

    updateCurrentUser: async (data) => {
        const response = await axiosClient.put('/user/me', data);
        return response?.data; 
    },

    uploadCV: async (cvFile) => {
        const formData = new FormData();
        formData.append('file', cvFile);
        
        const response = await axiosClient.put('/user/cvUpload', formData);

        return response?.data;
    }
};

export default userService;
 