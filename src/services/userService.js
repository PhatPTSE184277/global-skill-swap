import api from '../apis/axiosClient.js';

class UserService {
    async getCurrentUser() {
        const response = await api.get('/user/me');
        return response?.data?.data;
    }

    getCurrentUserFromStorage() { 
        try { 
            const authData = localStorage.getItem('authData'); 
            if (authData) { 
                const parsed = JSON.parse(authData); 
                return parsed.user || null; 
            } 
        } catch (error) { 
            // Silent fail 
        } 
        return null; 
    } 

    async getUserInfo() {
        try {
            return await this.getCurrentUser();
        } catch (error) {
            return this.getCurrentUserFromStorage();
        }
    }
}

const userService = new UserService();
export default userService;