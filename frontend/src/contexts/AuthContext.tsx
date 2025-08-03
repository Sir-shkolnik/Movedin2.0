import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  username: string;
  role: string;
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication on app load
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const userData = localStorage.getItem('admin_user');
        const sessionAuth = sessionStorage.getItem('isAuthenticated');

        if (token && userData && sessionAuth === 'true') {
          // Verify token with backend
          const response = await fetch('https://movedin-backend.onrender.com/api/auth/verify', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const user = JSON.parse(userData);
            setUser(user);
            setIsAuthenticated(true);
          } else {
            // Token is invalid, clear storage
            clearAuth();
          }
        } else {
          clearAuth();
        }
      } catch (error) {
        console.error('Auth check error:', error);
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const clearAuth = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    sessionStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    setUser(null);
  };

  const login = (token: string, userData: User) => {
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_user', JSON.stringify(userData));
    sessionStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    clearAuth();
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 