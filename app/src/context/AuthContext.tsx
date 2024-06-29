import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  DecodedToken,
  getToken,
  getUserFromToken,
  removeToken,
  setToken,
} from '@/utils/tokenUtils';
import apiClient from '@/services/apiService';

interface AuthContextType {
  user: DecodedToken | null;
  loading: boolean;
  login: (user: DecodedToken, navigate: (path: string) => void) => void;
  logout: (navigate: (path: string) => void) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          const decodedUser = getUserFromToken();
          if (decodedUser && decodedUser.exp > Date.now() / 1000) {
            setUser(decodedUser);
          } else {
            try {
              const response = await apiClient.post('/auth/refresh-token', {
                token,
              });
              setToken(response.data.accessToken);
              const refreshedUser = getUserFromToken();
              if (refreshedUser) {
                setUser(refreshedUser);
              } else {
                removeToken();
              }
            } catch (error) {
              console.error('Error refreshing token:', error);
              removeToken();
            }
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          removeToken();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (user: DecodedToken, navigate: (path: string) => void) => {
    setUser(user);
    navigate('/');
  };

  const logout = (navigate: (path: string) => void) => {
    setUser(null);
    removeToken();
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
