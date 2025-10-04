import gatewayApi from '../apis/gatewayClient.js';

class UserService {
    async getCurrentUser() {
        try {
            const response = await gatewayApi.get('/user/me');
            return response.data.data;
        } catch (error) {
            throw error;
        }
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