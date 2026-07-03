import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { fetchCurrentUser } from '../api/auth';
import { TOKEN_STORAGE_KEY } from '../api/client';
import { reconnectSocket } from '../services/socket';
import type { AuthResponse, User } from '../types';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  loginWithResponse: (response: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }
    fetchCurrentUser()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const loginWithResponse = useCallback((response: AuthResponse) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
    setUser(response.user);
    reconnectSocket();
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setUser(null);
    reconnectSocket();
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, loginWithResponse, logout }),
    [user, isLoading, loginWithResponse, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
