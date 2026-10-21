"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import {
  getCurrentUserProfile,
  updateUserProfile,
  signInWithEmail,
  signInWithGoogle,
  signOutUser,
  createAuthHeaders,
  getStoredToken,
  getStoredUser,
  saveStoredSession,
  clearStoredSession,
  type UserProfile,
  type AuthHeaders,
  type RegisterClientData,
} from "./auth-service";

interface AuthContextType {
  user: UserProfile | null;
  supabaseUser: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  headers: AuthHeaders;
  login: (email: string, password?: string) => Promise<void>;
  loginWithGoogle: (redirectPath?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<UserProfile | null>;
  updateProfile: (
    data: Partial<RegisterClientData & { avatarUrl?: string | null }>
  ) => Promise<UserProfile>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchProfile = useCallback(async (currentSupabaseUser?: User | null): Promise<UserProfile | null> => {
    try {
      const profile = await getCurrentUserProfile();
      setUser(profile);
      return profile;
    } catch {
      if (currentSupabaseUser) {
        const fallbackProfile: UserProfile = {
          id: currentSupabaseUser.id,
          name:
            (currentSupabaseUser.user_metadata?.name as string | undefined) ??
            (currentSupabaseUser.user_metadata?.full_name as string | undefined) ??
            currentSupabaseUser.email?.split("@")[0] ??
            "Usuário",
          email: currentSupabaseUser.email ?? "",
          phone: (currentSupabaseUser.user_metadata?.phone as string | undefined) ?? null,
          cpf: (currentSupabaseUser.user_metadata?.cpf as string | undefined) ?? null,
          avatarUrl:
            (currentSupabaseUser.user_metadata?.avatar_url as string | undefined) ?? null,
          role: (currentSupabaseUser.user_metadata?.role as string | undefined) ?? "Cliente",
        };
        setUser(fallbackProfile);
        return fallbackProfile;
      }
      return null;
    }
  }, []);

  const refreshUserProfile = useCallback(async () => {
    return await fetchProfile(supabaseUser);
  }, [supabaseUser, fetchProfile]);

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        const storedToken = getStoredToken();
        const storedUser = getStoredUser();

        if (storedToken) {
          setIsAuthenticated(true);
          if (storedUser) {
            setUser(storedUser);
          }
          setIsLoading(false);
        }

        const { data } = await supabase.auth.getSession();
        if (!mounted) return;

        if (data.session) {
          setSession(data.session);
          setSupabaseUser(data.session.user);
          setIsAuthenticated(true);
          setIsLoading(false);
          await fetchProfile(data.session.user);
        } else if (storedToken) {
          // Mantém autenticado se possuir token nos cookies / storage
          setIsAuthenticated(true);
          setIsLoading(false);
        } else {
          setSession(null);
          setSupabaseUser(null);
          setUser(null);
          setIsAuthenticated(false);
          clearStoredSession();
        }
      } catch (err) {
        console.error("[Auth] Erro ao obter sessão inicial:", err);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return;

      setSession(newSession);
      if (newSession?.user) {
        setSupabaseUser(newSession.user);
        setIsAuthenticated(true);
        setIsLoading(false);

        if (newSession.access_token) {
          const cached = getStoredUser();
          const initialProfile: UserProfile = cached ?? {
            id: newSession.user.id,
            name:
              (newSession.user.user_metadata?.name as string | undefined) ??
              (newSession.user.user_metadata?.full_name as string | undefined) ??
              newSession.user.email?.split("@")[0] ??
              "Usuário",
            email: newSession.user.email ?? "",
            phone: (newSession.user.user_metadata?.phone as string | undefined) ?? null,
            cpf: (newSession.user.user_metadata?.cpf as string | undefined) ?? null,
            avatarUrl: (newSession.user.user_metadata?.avatar_url as string | undefined) ?? null,
            role: (newSession.user.user_metadata?.role as string | undefined) ?? "Cliente",
            createdAt: newSession.user.created_at,
          };
          saveStoredSession(newSession.access_token, initialProfile);
          if (!user) setUser(initialProfile);
        }

        await fetchProfile(newSession.user);
      } else {
        setSupabaseUser(null);
        setUser(null);
        setIsAuthenticated(false);
        clearStoredSession();
      }
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      if (!password) {
        throw new Error("Senha é obrigatória");
      }
      const { data, error } = await signInWithEmail(email, password);
      if (error) {
        throw error;
      }
      if (data.session) {
        setSession(data.session);
        setSupabaseUser(data.session.user);
        setIsAuthenticated(true);

        const initialProfile: UserProfile = {
          id: data.session.user.id,
          name:
            (data.session.user.user_metadata?.name as string | undefined) ??
            (data.session.user.user_metadata?.full_name as string | undefined) ??
            data.session.user.email?.split("@")[0] ??
            "Usuário",
          email: data.session.user.email ?? "",
          phone: (data.session.user.user_metadata?.phone as string | undefined) ?? null,
          cpf: (data.session.user.user_metadata?.cpf as string | undefined) ?? null,
          avatarUrl: (data.session.user.user_metadata?.avatar_url as string | undefined) ?? null,
          role: (data.session.user.user_metadata?.role as string | undefined) ?? "Cliente",
          createdAt: data.session.user.created_at,
        };
        saveStoredSession(data.session.access_token, initialProfile);
        setUser(initialProfile);

        await fetchProfile(data.session.user);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (redirectPath?: string) => {
    setIsLoading(true);
    try {
      const { error } = await signInWithGoogle(redirectPath);
      if (error) throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOutUser();
      setSession(null);
      setSupabaseUser(null);
      setUser(null);
      setIsAuthenticated(false);
      clearStoredSession();
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (
    data: Partial<RegisterClientData & { avatarUrl?: string | null }>
  ): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      const updated = await updateUserProfile(data);
      setUser(updated);
      return updated;
    } finally {
      setIsLoading(false);
    }
  };

  const headers = createAuthHeaders(session?.access_token);

  return (
    <AuthContext.Provider
      value={{
        user,
        supabaseUser,
        session,
        isAuthenticated,
        isLoading,
        headers,
        login,
        loginWithGoogle,
        logout,
        refreshUserProfile,
        updateProfile,
      }}
    >
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
