import { DecodedToken } from '@/utils/tokenUtils';
import { createContext, useContext, useState } from 'react';

interface AuthContextType {
  user: DecodedToken | null;
  setUser: (user: DecodedToken | null) => void;
  login: (user: DecodedToken, navigate?: (path: string) => void) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<DecodedToken | null>(null);

  const login = (user: DecodedToken, navigate?: (path: string) => void) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    if (navigate) {
      navigate('/');
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 