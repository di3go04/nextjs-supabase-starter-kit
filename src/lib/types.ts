/**
 * Tipos compartidos de la aplicación.
 */

export type UserRole = "user" | "admin" | "free" | "premium";

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  status: string;
  plan: "free" | "pro" | "enterprise";
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Usuario "enriquecido" que combina auth.uid + profile row.
 * Es lo que exponemos al cliente vía el hook `useUser`.
 */
export interface AppUser {
  id: string;
  email: string | null;
  role: UserRole;
  profile: Profile | null;
}
