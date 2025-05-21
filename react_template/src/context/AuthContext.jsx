// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../services/AuthService';

// Create context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from service
  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = AuthService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    // Set up auth state listener
    const removeListener = AuthService.addAuthListener((newUser) => {
      setUser(newUser);
    });

    initAuth();

    // Clean up listener when component unmounts
    return () => {
      removeListener();
    };
  }, []);

  // Login function
  const login = async (persona = null) => {
    try {
      setLoading(true);
      const loggedInUser = await AuthService.login(persona);
      setUser(loggedInUser);
      setError(null);
      return loggedInUser;
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Select persona function (for demo purposes)
  const selectPersona = async (personaIndex) => {
    try {
      setLoading(true);
      const selectedUser = await AuthService.selectPersona(personaIndex);
      setUser(selectedUser);
      setError(null);
      return selectedUser;
    } catch (err) {
      console.error('Select persona error:', err);
      setError('Failed to select persona. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      await AuthService.logout();
      setUser(null);
      setError(null);
      return true;
    } catch (err) {
      console.error('Logout error:', err);
      setError('Logout failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Check if user has a specific permission
  const hasPermission = (permission) => {
    if (!user) return false;
    return AuthService.checkPermission(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        selectPersona,
        hasPermission,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};