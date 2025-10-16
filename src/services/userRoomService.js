import api from '../apis/axiosClient.js';

class UserService {
    // Return the full API response so callers that expect wrapper ({ success, data }) continue to work
    async getCurrentUser() {
        const response = await api.get('/user/me');
        return response?.data
    }

    getCurrentUserFromStorage() { 
        try { 
            const authData = localStorage.getItem('authData'); 
            if (authData) { 
                const parsed = JSON.parse(authData); 
                // Tương thích với cấu trúc hiện tại của Redux/LoginPage
                return parsed.user || null; 
            } 
        } catch { 
            // Silent fail 
        } 
        return null; 
    } 

    // Return normalized user object (try API first, then storage). This handles multiple API shapes.
    async getUserInfo() {
        try {
            const res = await this.getCurrentUser();
            // Handle common response shapes
            // 1) { data: { success: true, data: user } }
            if (res?.data) {
                return res.data;
            }
            // Fallback to storage
            return this.getCurrentUserFromStorage();
        } catch {
            return this.getCurrentUserFromStorage();
        }
    }

    // Get user by id (used by meeting room helpers)
    async getUserById(userId) {
        try {
            const response = await api.get(`/user/${userId}`);
            // return user object if available
            return response?.data?.data || response?.data || null;
        } catch (err) {
            console.error('Error fetching user by id:', err);
            return null;
        }
    }

   


    // Get user ID with fallback
    getUserId() {
        const user = this.getCurrentUserFromStorage();
        // Tương thích với Redux structure: _id, id, userId
        return user?.id || user?.userId || null;
    }
}

const userService = new UserService();
export default userService;