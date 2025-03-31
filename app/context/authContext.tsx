import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../lib/api';
import {
  setToken as setTokenStorage,
  getToken,
  removeToken as removeTokenStorage,
} from '../lib/auth';

interface User {
  id: string;
  name: string;
  email: string;
  // Add other user properties as needed
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUserFromLocalStorage = async () => {
      const token = getToken();

      if (token) {
        try {
          const response = await api.get('/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data.user);
          setToken(token);
        } catch (error: any) {
          console.error('Error loading user from localStorage:', error);
          removeTokenStorage();
          setUser(null);
          setToken(null);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    loadUserFromLocalStorage();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post('/login', { email, password });
      const { token, user } = response.data;

      setUser(user);
      setToken(token);
      setTokenStorage(token); // Store in localStorage

      router.push('/dashboard');
    } catch (error: any) {
      console.error('Login failed:', error);
      throw error; // Re-throw for the login form to handle
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    removeTokenStorage(); // Remove from localStorage
    setUser(null);
    setToken(null);
    router.push('/login');
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;