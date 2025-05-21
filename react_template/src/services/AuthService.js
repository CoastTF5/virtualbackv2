// src/services/AuthService.js
import { userPersonas } from '../data/mockData';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.listeners = [];
    this.isAuthenticated = false;

    // Check for saved user in localStorage
    this.initFromStorage();
  }

  initFromStorage() {
    try {
      const savedUser = localStorage.getItem('virtualBacklotUser');
      if (savedUser) {
        this.currentUser = JSON.parse(savedUser);
        this.isAuthenticated = true;
      }
    } catch (e) {
      console.error('Failed to load user from storage:', e);
    }
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Add a listener for auth state changes
  addAuthListener(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify listeners of auth state changes
  notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener(this.currentUser);
      } catch (e) {
        console.error('Error in auth listener:', e);
      }
    });
  }

  // Login with credentials (simple mock for prototype)
  async login(persona = null) {
    // In a real app, this would authenticate with a backend
    return new Promise((resolve) => {
      setTimeout(() => {
        // For the prototype, just "authenticate" successfully
        if (persona) {
          // Use the specified persona
          this.currentUser = persona;
        } else {
          // Default to first persona
          this.currentUser = userPersonas[0];
        }

        this.isAuthenticated = true;
        localStorage.setItem('virtualBacklotUser', JSON.stringify(this.currentUser));
        this.notifyListeners();
        resolve(this.currentUser);
      }, 800);
    });
  }

  // Select a specific persona (for demo purposes)
  async selectPersona(personaIndex) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (personaIndex >= 0 && personaIndex < userPersonas.length) {
          const selectedPersona = userPersonas[personaIndex];
          this.currentUser = selectedPersona;
          this.isAuthenticated = true;
          localStorage.setItem('virtualBacklotUser', JSON.stringify(this.currentUser));
          this.notifyListeners();
          resolve(this.currentUser);
        } else {
          reject(new Error('Invalid persona selection'));
        }
      }, 500);
    });
  }

  // Logout
  async logout() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.currentUser = null;
        this.isAuthenticated = false;
        localStorage.removeItem('virtualBacklotUser');
        this.notifyListeners();
        resolve(true);
      }, 500);
    });
  }

  // Check if user has a specific permission
  checkPermission(permission) {
    if (!this.currentUser) return false;
    return this.currentUser.permissions.includes(permission);
  }
}

// Create singleton instance
const authService = new AuthService();

export { authService as AuthService };