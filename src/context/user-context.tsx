"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { AppUser, Profile, UserRole } from "@/lib/types";

interface UserContextValue {
  /** Usuario enriquecido (auth + profile) o null si no hay sesión. */
  user: AppUser | null;
  /** Sesión cruda de Supabase (útil para tokens). */
  session: Session | null;
  /** True mientras cargamos la sesión por primera vez. */
  isLoading: boolean;
  /** Refresca el profile desde la DB (sin refrescar la sesión). */
  refreshProfile: () => Promise<void>;
  /** Logout limpio. */
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

async function fetchProfile(
  supabase: ReturnType<typeof createSupabaseBrowserClient>,
  user: User,
): Promise<Profile | null> {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  return (data as Profile | null) ?? null;
}

function toAppUser(user: User, profile: Profile | null): AppUser {
  return {
    id: user.id,
    email: user.email ?? null,
    role: (profile?.role as UserRole) ?? "user",
    profile,
  };
}

export function UserProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [state, setState] = useState<{
    user: AppUser | null;
    session: Session | null;
    isLoading: boolean;
  }>({
    user: null,
    session: null,
    isLoading: true,
  });

  const loadSession = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      setState({ user: null, session: null, isLoading: false });
      return;
    }

    const profile = await fetchProfile(supabase, session.user);
    setState({
      user: toAppUser(session.user, profile),
      session,
      isLoading: false,
    });
  }, [supabase]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSession();

    // Suscripción a cambios de auth (login, logout, refresh).
    const { data: sub } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!session?.user) {
          setState({ user: null, session: null, isLoading: false });
          return;
        }
        const profile = await fetchProfile(supabase, session.user);
        setState({
          user: toAppUser(session.user, profile),
          session,
          isLoading: false,
        });
      },
    );

    return () => sub.subscription.unsubscribe();
  }, [supabase, loadSession]);

  const refreshProfile = useCallback(async () => {
    if (!state.user) return;
    // Hacemos un fetch fresco desde Supabase para no depender del tipo User.
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", state.user.id)
      .maybeSingle();

    setState((s) => ({
      ...s,
      user: s.user ? { ...s.user, profile: profile as Profile | null } : null,
    }));
  }, [supabase, state.user]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setState({ user: null, session: null, isLoading: false });
    // Redirige al login.
    window.location.href = "/login";
  }, [supabase]);

  const value: UserContextValue = {
    user: state.user,
    session: state.session,
    isLoading: state.isLoading,
    refreshProfile,
    signOut,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (ctx === undefined) {
    throw new Error("useUser debe usarse dentro de un <UserProvider>");
  }
  return ctx;
}
