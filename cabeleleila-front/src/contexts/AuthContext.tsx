import { createContext, useContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const user = token ? jwtDecode<any>(token) : null;

  return <AuthContext.Provider value={{ token, login, logout, user }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
