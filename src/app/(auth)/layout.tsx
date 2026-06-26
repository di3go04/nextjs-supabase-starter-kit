import type { Metadata } from "next";
import { UserProvider } from "@/context/user-context";

export const metadata: Metadata = {
  title: "Auth | Next.js Supabase Starter",
};

/**
 * Layout para rutas de autenticación (login, register, callback).
 * Es delgado: solo monta el UserProvider para que `useUser` esté disponible.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <UserProvider>{children}</UserProvider>;
}
