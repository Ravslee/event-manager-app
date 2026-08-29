import { useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "@/context/AuthContext";
import { tokenService } from "@/features/auth/utils/tokenService";
import { AuthApi } from "@/features/auth/api/auth.api";
import { type User, type LoginResponse } from "@/features/auth/types/auth.types";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => tokenService.getUser());
  const [accessToken, setAccessToken] = useState<string | null>(() => tokenService.getAccessToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const queryClient = useQueryClient();
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);


  const clearRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  const logout = useCallback(async () => {
    clearRefreshTimer();
    try {
      await AuthApi.logout();
    } catch {
      // Ignore network errors on logout API call
    } finally {
      tokenService.clearAuthStorage();
      setUser(null);
      setAccessToken(null);
      queryClient.clear();
    }
  }, [clearRefreshTimer, queryClient]);

  const performTokenRefresh = useCallback(async () => {
    const refreshToken = tokenService.getRefreshToken();
    if (!refreshToken) {
      await logout();
      return;
    }

    try {
      const res = await AuthApi.refreshToken(refreshToken);
      const newAccessToken =
        res.accessToken || res.token || res.data?.accessToken || res.data?.token;
      const newRefreshToken =
        res.refreshToken || res.data?.refreshToken || refreshToken;

      if (!newAccessToken) {
        throw new Error("Invalid token refresh response");
      }

      tokenService.setTokens(newAccessToken, newRefreshToken);
      setAccessToken(newAccessToken);

      // Re-schedule proactive refresh for new token
      scheduleTokenRefresh(newAccessToken);
    } catch {
      await logout();
    }
  }, [logout]);

  const scheduleTokenRefresh = useCallback(
    (token: string) => {
      clearRefreshTimer();

      const expMs = tokenService.getTokenExpiration(token);
      if (!expMs) return;

      const now = Date.now();
      const timeUntilExp = expMs - now;

      // Refresh 60 seconds before expiration (or at half-life if token lifespan is short)
      const refreshBuffer = 60 * 1000;
      const delay = Math.max(timeUntilExp - refreshBuffer, timeUntilExp / 2, 5000);

      // Only schedule if token is not already expired
      if (timeUntilExp > 0) {
        refreshTimerRef.current = setTimeout(() => {
          performTokenRefresh();
        }, delay);
      } else {
        performTokenRefresh();
      }
    },
    [clearRefreshTimer, performTokenRefresh]
  );

  const login = useCallback(
    (responseData: LoginResponse) => {
      const token =
        responseData.accessToken ||
        responseData.token ||
        responseData.data?.accessToken ||
        responseData.data?.token;
      const refreshToken =
        responseData.refreshToken || responseData.data?.refreshToken;
      const userData =
        responseData.user || responseData.data?.user || null;

      if (token) {
        tokenService.setTokens(token, refreshToken);
        setAccessToken(token);
        scheduleTokenRefresh(token);
      }

      if (userData) {
        tokenService.setUser(userData);
        setUser(userData);
      }
    },
    [scheduleTokenRefresh]
  );

  const updateUser = useCallback((updatedFields: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedFields };
      tokenService.setUser(updated);
      return updated;
    });
  }, []);

  // Initialize Auth state on app load
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = tokenService.getAccessToken();
      const storedUser = tokenService.getUser();

      if (storedToken) {
        // If stored token is expired, try refreshing
        if (tokenService.isTokenExpired(storedToken, 30)) {
          const refreshToken = tokenService.getRefreshToken();
          if (refreshToken) {
            try {
              const res = await AuthApi.refreshToken(refreshToken);
              const newAccessToken =
                res.accessToken || res.token || res.data?.accessToken || res.data?.token;
              const newRefreshToken =
                res.refreshToken || res.data?.refreshToken || refreshToken;

              if (newAccessToken) {
                tokenService.setTokens(newAccessToken, newRefreshToken);
                setAccessToken(newAccessToken);
                scheduleTokenRefresh(newAccessToken);
              } else {
                tokenService.clearAuthStorage();
                setUser(null);
                setAccessToken(null);
              }
            } catch {
              tokenService.clearAuthStorage();
              setUser(null);
              setAccessToken(null);
            }
          } else {
            tokenService.clearAuthStorage();
            setUser(null);
            setAccessToken(null);
          }
        } else {
          setAccessToken(storedToken);
          if (storedUser) setUser(storedUser);
          scheduleTokenRefresh(storedToken);

          // Fetch fresh user profile in background
          AuthApi.getCurrentUser().then((freshUser) => {
            if (freshUser) {
              tokenService.setUser(freshUser);
              setUser(freshUser);
            }
          });
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, [scheduleTokenRefresh]);

  // Listen for forced logout events (from Axios 401 interceptor or storage change)
  useEffect(() => {
    const handleForcedLogout = () => {
      logout();
    };

    const handleProfileUpdate = () => {
      const freshUser = tokenService.getUser();
      if (freshUser) setUser(freshUser);
    };

    window.addEventListener("auth:logout", handleForcedLogout);
    window.addEventListener("profileUpdated", handleProfileUpdate);

    return () => {
      window.removeEventListener("auth:logout", handleForcedLogout);
      window.removeEventListener("profileUpdated", handleProfileUpdate);
      clearRefreshTimer();
    };
  }, [logout, clearRefreshTimer]);

  const value = {
    user,
    accessToken,
    isAuthenticated: Boolean(accessToken && user),
    isLoading,
    login,
    logout,
    refreshToken: performTokenRefresh,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
