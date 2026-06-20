import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = "quicklog_auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, restore auth from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.token && parsed.user) {
          setToken(parsed.token);
          setUser(parsed.user);
        }
      }
    } catch (e) {
      console.error("Failed to restore auth session:", e);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ token: newToken, user: newUser })
    );
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  // Call this after a successful profile update to keep state + localStorage in sync
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    const stored = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY));
    if (stored) {
      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ token: stored.token, user: updatedUser })
      );
    }
  };

  const isLoggedIn = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
