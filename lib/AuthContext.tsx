import React, { createContext, useContext, useCallback, useEffect, useMemo, useState } from "react";
import {
  clearAuthSession,
  getAccessToken,
  getStoredUser,
  saveAuthSession,
  type AuthUser,
} from "@/lib/authStorage";

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (token: string, user: AuthUser) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      try {
        const [storedToken, storedUser] = await Promise.all([
          getAccessToken(),
          getStoredUser(),
        ]);

        setToken(storedToken);
        setUser(storedUser);
      } finally {
        setIsLoading(false);
      }
    }

    bootstrap();
  }, []);

const signIn = useCallback(async (nextToken: string, nextUser: AuthUser) => {
  await saveAuthSession(nextToken, nextUser);
  setToken(nextToken);
  setUser(nextUser);
}, []);

const signOut = useCallback(async () => {
  await clearAuthSession();
  setToken(null);
  setUser(null);
}, []);

const value = useMemo(
  () => ({
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    signIn,
    signOut,
  }),
  [user, token, isLoading, signIn, signOut]
);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}