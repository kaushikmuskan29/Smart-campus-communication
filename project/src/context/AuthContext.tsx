import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { generateMockUsers } from '../utils/mockData';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    
    // Ensure we have mock users in localStorage
    const existingUsers = localStorage.getItem('users');
    if (!existingUsers) {
      const mockUsers = generateMockUsers();
      localStorage.setItem('users', JSON.stringify(mockUsers));
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    try {
      // Mock authentication - in real app, this would verify against an API
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: User) => u.email.toLowerCase() === email.toLowerCase());
      
      if (user && password === 'password') {
        setCurrentUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('currentUser', JSON.stringify(user));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    try {
      setCurrentUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('currentUser');
      // Redirect to login page
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // For demo purposes - allow switching between roles
  const switchRole = (role: UserRole) => {
    if (currentUser) {
      try {
        const updatedUser = { ...currentUser, role };
        setCurrentUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      } catch (error) {
        console.error('Role switch error:', error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};