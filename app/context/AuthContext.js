// context/AuthContext.js
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import authService from '../services/authService';

// Initial state
const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  token: null,
  error: null,
};

// Action types
const AUTH_ACTION_TYPES = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_USER: 'UPDATE_USER',
};

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case AUTH_ACTION_TYPES.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };

    case AUTH_ACTION_TYPES.LOGOUT:
      return {
        ...initialState,
        isLoading: false,
      };

    case AUTH_ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case AUTH_ACTION_TYPES.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case AUTH_ACTION_TYPES.UPDATE_USER:
      return {
        ...state,
        user: action.payload,
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is already authenticated on app start
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      dispatch({ type: AUTH_ACTION_TYPES.SET_LOADING, payload: true });
      
      const isAuthenticated = await authService.isAuthenticated();
      
      if (isAuthenticated) {
        const user = await authService.getCurrentUser();
        const token = await authService.getToken();
        
        dispatch({
          type: AUTH_ACTION_TYPES.LOGIN_SUCCESS,
          payload: { user, token }
        });
      } else {
        dispatch({ type: AUTH_ACTION_TYPES.SET_LOADING, payload: false });
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      dispatch({ type: AUTH_ACTION_TYPES.SET_ERROR, payload: error.message });
    }
  };

  // Login function
  const login = async (credentials, userType = 'customer') => {
    try {
      dispatch({ type: AUTH_ACTION_TYPES.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTION_TYPES.CLEAR_ERROR });

      let result;
      
      if (userType === 'customer') {
        result = await authService.customerLogin(credentials);
      } else if (userType === 'merchant') {
        result = await authService.merchantLogin(credentials);
      }

      if (result.success) {
        dispatch({
          type: AUTH_ACTION_TYPES.LOGIN_SUCCESS,
          payload: {
            user: result.user,
            token: result.token
          }
        });
        return result;
      } else {
        dispatch({ type: AUTH_ACTION_TYPES.SET_ERROR, payload: result.message });
        return result;
      }
    } catch (error) {
      dispatch({ type: AUTH_ACTION_TYPES.SET_ERROR, payload: error.message });
      return { success: false, message: error.message };
    }
  };

  // Signup function
  const signup = async (userData, userType = 'customer') => {
    try {
      dispatch({ type: AUTH_ACTION_TYPES.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTION_TYPES.CLEAR_ERROR });

      let result;
      
      if (userType === 'customer') {
        result = await authService.customerSignup(userData);
      } else if (userType === 'merchant') {
        result = await authService.merchantSignup(userData);
      }

      if (result.success) {
        dispatch({
          type: AUTH_ACTION_TYPES.LOGIN_SUCCESS,
          payload: {
            user: result.user,
            token: result.token
          }
        });
        return result;
      } else {
        dispatch({ type: AUTH_ACTION_TYPES.SET_ERROR, payload: result.message });
        return result;
      }
    } catch (error) {
      dispatch({ type: AUTH_ACTION_TYPES.SET_ERROR, payload: error.message });
      return { success: false, message: error.message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
      dispatch({ type: AUTH_ACTION_TYPES.LOGOUT });
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, message: error.message };
    }
  };

  // Update user function
  const updateUser = async (userData) => {
    try {
      const result = await authService.updateUserData(userData);
      if (result.success) {
        dispatch({ type: AUTH_ACTION_TYPES.UPDATE_USER, payload: userData });
      }
      return result;
    } catch (error) {
      console.error('Update user error:', error);
      return { success: false, message: error.message };
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTION_TYPES.CLEAR_ERROR });
  };

  const value = {
    // State
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    user: state.user,
    token: state.token,
    error: state.error,
    
    // Actions
    login,
    signup,
    logout,
    updateUser,
    clearError,
    checkAuthState,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;