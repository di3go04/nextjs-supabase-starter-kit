import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { UserRole } from "@/lib/types";

/**
 * Middleware de auth + RBAC.
 *
 * NOTA: NO integra el middleware de next-intl para evitar conflictos
 * con el routing del App Router. El locale se gestiona por cookie
 * (`NEXT_LOCALE`) seteada por el `LanguageSwitcher`. next-intl lee
 * esa cookie en `getRequestConfig` (ver `src/i18n/request.ts`).
 *
 * Si quieres URLs localizadas (/es/login, /en/login), copia este
 * middleware y combínalo con `createIntlMiddleware` de next-intl.
 */

interface RouteRule {
  pattern: RegExp;
  roles: UserRole[];
}

const PROTECTED_ROUTES: RouteRule[] = [
  { pattern: /^\/dashboard(\/.*)?$/, roles: [] },
  { pattern: /^\/dashboard\/admin(\/.*)?$/, roles: ["admin"] },
];

function getRequiredRoles(pathname: string): UserRole[] | null {
  for (const rule of PROTECTED_ROUTES) {
    if (rule.pattern.test(pathname)) return rule.roles;
  }
  return null;
}

async function getUserRole(
  supabase: ReturnType<typeof createServerClient>,
  userId: string,
): Promise<UserRole> {
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();
  return (data?.role as UserRole) ?? "user";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    (pathname.startsWith("/api") && pathname !== "/api/webhooks/stripe") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    return supabaseResponse;
  }

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const requiredRoles = getRequiredRoles(pathname);

  if (requiredRoles !== null && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (requiredRoles !== null && requiredRoles.length > 0 && user) {
    const role = await getUserRole(supabase, user.id);
    if (!requiredRoles.includes(role)) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/dashboard";
      redirectUrl.searchParams.set("error", "forbidden");
      return NextResponse.redirect(redirectUrl);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
