import axiosClient from '../../apis/axiosClient';

export const fetchAllProducts = async ({
    page = 0,
    size = 10,
    sortBy = 'id',
    sortDir = 'desc'
} = {}) => {
    const params = { page, size, sortBy, sortDir };
    const response = await axiosClient.get('/product', { params });
    return response?.data;
};

export const fetchProductById = async (id) => {
    const response = await axiosClient.get(`/product/${id}`);
    return response?.data;
};

export const createProduct = async (data) => {
    const response = await axiosClient.post('/product', data);
    return response?.data;
};

export const updateProductById = async (id, data) => {
    const response = await axiosClient.put(`/product/${id}`, data);
    return response?.data;
};
