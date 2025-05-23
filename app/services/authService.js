// services/authService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://localhost:5000/api';


class AuthService {
  constructor() {
    this.token = null;
    this.user = null;
  }

  // Helper method to make API calls
  async apiCall(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Call Error:', error);
      throw error;
    }
  }

  // Customer Signup
  async customerSignup(userData) {
    try {
      const response = await this.apiCall('/auth/customer/signup', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      if (response.status === 'success') {
        // Store token and user data
        this.token = response.token;
        this.user = response.data.user;
        
        // Persist to AsyncStorage
        await AsyncStorage.setItem('userToken', response.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
        
        return {
          success: true,
          user: response.data.user,
          token: response.token,
          message: response.message
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Signup failed'
      };
    }
  }

  // Customer Login
  async customerLogin(credentials) {
    try {
      const response = await this.apiCall('/auth/customer/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      if (response.status === 'success') {
        // Store token and user data
        this.token = response.token;
        this.user = response.data.user;
        
        // Persist to AsyncStorage
        await AsyncStorage.setItem('userToken', response.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
        
        return {
          success: true,
          user: response.data.user,
          token: response.token,
          message: response.message
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Login failed'
      };
    }
  }

  // Merchant Signup
  async merchantSignup(userData) {
    try {
      const response = await this.apiCall('/auth/merchant/signup', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      if (response.status === 'success') {
        this.token = response.token;
        this.user = response.data.user;
        
        await AsyncStorage.setItem('userToken', response.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
        
        return {
          success: true,
          user: response.data.user,
          token: response.token,
          message: response.message
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Merchant signup failed'
      };
    }
  }

  // Merchant Login
  async merchantLogin(credentials) {
    try {
      const response = await this.apiCall('/auth/merchant/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      if (response.status === 'success') {
        this.token = response.token;
        this.user = response.data.user;
        
        await AsyncStorage.setItem('userToken', response.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
        
        return {
          success: true,
          user: response.data.user,
          token: response.token,
          message: response.message
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Merchant login failed'
      };
    }
  }

  // Check if user is authenticated
  async isAuthenticated() {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userData = await AsyncStorage.getItem('userData');
      
      if (token && userData) {
        this.token = token;
        this.user = JSON.parse(userData);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        this.user = JSON.parse(userData);
        return this.user;
      }
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Get stored token
  async getToken() {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        this.token = token;
        return token;
      }
      return null;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  // Logout
  async logout() {
    try {
      // Clear local state
      this.token = null;
      this.user = null;
      
      // Clear AsyncStorage
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      
      return { success: true };
    } catch (error) {
      console.error('Error during logout:', error);
      return { success: false, message: 'Logout failed' };
    }
  }

  // Update user data in storage
  async updateUserData(userData) {
    try {
      this.user = userData;
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      console.error('Error updating user data:', error);
      return { success: false };
    }
  }
}

// Create and export a singleton instance
const authService = new AuthService();
export default authService;