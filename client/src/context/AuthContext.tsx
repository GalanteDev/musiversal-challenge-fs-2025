import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AuthContextType {
  token: string | null;
  user: { id: string; email: string } | null;
  login: (token: string, user: { id: string; email: string }) => void;
  logout: () => void;
  loading: boolean; // <-- nuevo
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true); // <-- nuevo

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    console.log("AuthProvider init:", { savedToken, savedUser });

    if (savedToken) setToken(savedToken);

    if (
      savedUser &&
      savedUser !== "undefined" &&
      savedUser !== "null" &&
      savedUser !== null
    ) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }

    setLoading(false);
  }, []);

  const login = (token: string, user: { id: string; email: string } | null) => {
    localStorage.setItem("token", token);

    if (user && typeof user === "object") {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }

    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
