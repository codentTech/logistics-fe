import api from '@/common/utils/api';
import { removeUser } from '@/common/utils/users.util';

// Login user - OpsCore backend format
const login = async (loginPayload) => {
  try {
    const response = await api().post('/v1/auth/login', loginPayload);
    if (response.data.success && response.data.token) {
      // Store user data with token in OpsCore format
      const userData = {
        id: response.data.user.id,
        email: response.data.user.email,
        role: response.data.user.role,
        tenantId: response.data.user.tenantId,
        token: response.data.token,
      };
      localStorage.setItem('user', JSON.stringify(userData));
    }
    return response.data;
  } catch (error) {
    // Re-throw to let the slice handle it
    throw error;
  }
};

// Logout user
const logout = async () => {
  removeUser();
  return { success: true };
};

const authService = {
  logout,
  login,
};

export default authService;
