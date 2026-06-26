import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { UserProvider } from "@/context/user-context";
import { DashboardHeader } from "@/components/dashboard/header";
import type { Profile } from "@/lib/types";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  // En lugar de pasar el usuario vía prop (que rompería el contrato de UserProvider),
  // montamos el provider y dejamos que cargue la sesión por sí mismo desde las cookies.
  // Es más limpio y evita hidration mismatches.
  return (
    <UserProvider>
      <div className="min-h-screen flex flex-col bg-muted/30">
        <DashboardHeader />
        <main className="flex-1 p-4 md:p-6 max-w-6xl mx-auto w-full">{children}</main>
        <footer className="border-t py-4 text-center text-xs text-muted-foreground">
          Next.js + Supabase Starter Kit
        </footer>
      </div>
    </UserProvider>
  );
}

// Evita warning de variable no usada (profile se valida arriba por si quieres inyectar).
export type _ProfileRef = Profile;
