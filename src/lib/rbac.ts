import type { UserRole } from "@/lib/types";

/**
 * Helper de RBAC.
 * Define jerarquía de roles y utilidades para verificar permisos.
 */

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  user: 0,
  free: 1,
  premium: 2,
  admin: 100,
};

/**
 * Comprueba si un usuario con `userRole` cumple el requisito `required`.
 * - Si `required` incluye "*", cualquiera autenticado pasa.
 * - Si no, pasa si el rol del usuario tiene un nivel >= a alguno de los requeridos.
 */
export function hasRole(
  userRole: UserRole | undefined | null,
  required: UserRole[] | "*",
): boolean {
  if (!userRole) return false;
  if (required === "*") return true;
  if (required.length === 0) return true;
  return required.some((r) => ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[r]);
}

export const ROLE_LABELS: Record<UserRole, string> = {
  user: "Usuario",
  free: "Free",
  premium: "Premium",
  admin: "Admin",
};

export const ROLE_BADGE_CLASS: Record<UserRole, string> = {
  user: "bg-muted text-muted-foreground",
  free: "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300",
  premium:
    "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  admin: "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
};
