import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios, { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role?: string
  ) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem("token");

        if (token) {
          // Check if token is expired
          const decodedToken: { exp?: number } = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decodedToken.exp && decodedToken.exp < currentTime) {
            // Token expired
            localStorage.removeItem("token");
            setUser(null);
          } else {
            // Token valid, get user data
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            const res = await axios.get(
              "http://localhost:5000/api/auth/profile"
            );
            setUser(res.data);
          }
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("Authentication error:", axiosError);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);
  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { token, ...userData } = res.data;

      // Save token to localStorage
      localStorage.setItem("token", token);

      // Set auth header for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Set user in state
      setUser(userData);

      toast.success("Logged in successfully");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        ((error as AxiosError).response?.data as { message: string })
          ?.message || "Login failed"
      );
      throw error;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role?: string
  ) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
        role,
      });

      const { token, ...userData } = res.data;

      // Save token to localStorage
      localStorage.setItem("token", token);

      // Set auth header for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Set user in state
      setUser(userData);

      toast.success("Registered successfully");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(
        ((error as AxiosError).response?.data as { message: string })
          ?.message || "Registration failed"
      );
      throw error;
    }
  };

  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");

    // Remove auth header
    delete axios.defaults.headers.common["Authorization"];

    // Clear user from state
    setUser(null);

    toast.info("Logged out");
  };

  const isAdmin = () => {
    return user?.role === "admin";
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};
