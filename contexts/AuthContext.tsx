"use client";

import {
  createContext,
  useState,
  useContext,
  type ReactNode,
  useEffect,
} from "react";

import type { AuthUser } from "@/types/user.type";
import {
  clearGuestCartToken,
  clearStoredAuth,
  getStoredCustomerAuthToken,
  getStoredUserJson,
  migrateLegacyGuestTokenFromTokenSlot,
  setStoredAuth,
} from "@/utils/authStorage";

export interface AuthContextType {
  authUser: AuthUser | null;
  token: string | null;
  isLoggedIn: boolean;
  isHydrated: boolean;
  login: (AuthUser: AuthUser, token: string, expiresAt: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    migrateLegacyGuestTokenFromTokenSlot();
    try {
      const storedToken = getStoredCustomerAuthToken();
      const storedUserJson = getStoredUserJson();

      if (!storedToken) {
        setAuthUser(null);
        setToken(null);
      } else {
        setToken(storedToken);
        if (storedUserJson) {
          setAuthUser(JSON.parse(storedUserJson) as AuthUser);
        }
      }
    } catch {
      // Ignore malformed storage
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const isLoggedIn = authUser !== null;

  function login(AuthUser: AuthUser, token: string, expiresAt: string) {
    setStoredAuth(JSON.stringify(AuthUser), token, expiresAt);
    clearGuestCartToken();
    setAuthUser(AuthUser);
    setToken(token);
  }

  function logout() {
    clearStoredAuth();
    setAuthUser(null);
    setToken(null);
  }

  const value: AuthContextType = {
    authUser,
    token,
    isLoggedIn,
    isHydrated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
