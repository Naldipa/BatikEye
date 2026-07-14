import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { AuthContext } from "./AuthContextValue";

const getStoredUser = () => {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser());
  const [isAuthenticated, setIsAuthenticated] = useState(
    () =>
      Boolean(localStorage.getItem("access_token")) &&
      Boolean(getStoredUser()),
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("access_token");

      if (!storedUser && !storedToken) {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("batikeye_user");
        localStorage.removeItem("batikeye_token");
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get("/api/me");
        const currentUser =
          data?.user ||
          data?.profile ||
          (storedUser ? JSON.parse(storedUser) : null);

        if (!currentUser) {
          throw new Error("Session tidak valid");
        }

        setUser(currentUser);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(currentUser));
        localStorage.removeItem("batikeye_user");
      } catch {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("batikeye_user");
        localStorage.removeItem("batikeye_token");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = (userData, token) => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("batikeye_user");
    localStorage.removeItem("batikeye_token");

    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData));

    if (token) {
      localStorage.setItem("access_token", token);
    }
  };

  const logout = async () => {
    try {
      await api.post("/api/logout");
    } catch (error) {
      console.error("Logout gagal:", error.message);
    }

    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("batikeye_user");
    localStorage.removeItem("batikeye_token");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
