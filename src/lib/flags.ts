import { get } from "@vercel/edge-config";
import { logger } from "@/lib/logger";

/**
 * Feature flags con Vercel Edge Config.
 * Permite activar/desactivar features sin redeploy.
 *
 * Si EDGE_CONFIG no está configurado, devuelve defaultValue.
 *
 * Uso:
 *   if (await getFlag("new-onboarding", false)) { ... }
 *
 * Configuración:
 *   1. Crea un Edge Config en Vercel dashboard.
 *   2. Vincula el store a tu proyecto (genera automáticamente EDGE_CONFIG env).
 *   3. Setea flags con: vercel env pull && vercel edge-config set new-onboarding true
 */

export async function getFlag<T = boolean>(
  key: string,
  defaultValue: T,
): Promise<T> {
  if (!process.env.EDGE_CONFIG) {
    return defaultValue;
  }

  try {
    const value = await get<T>(key);
    return value ?? defaultValue;
  } catch (err) {
    logger.warn({
      msg: "Edge Config fetch failed",
      key,
      error: err instanceof Error ? err.message : String(err),
    });
    return defaultValue;
  }
}

/**
 * Flags predefinidas del starter kit.
 * Añade aquí las tuyas para tipado seguro.
 */
export const FLAGS = {
  NEW_ONBOARDING: "new-onboarding",
  TEAMS_ENABLED: "teams-enabled",
  AI_FEATURES: "ai-features",
  BETA_ADMIN: "beta-admin",
} as const;

export type FlagKey = (typeof FLAGS)[keyof typeof FLAGS];

/**
 * Helper para usar flags tipadas.
 *
 * if (await isFlagEnabled(FLAGS.TEAMS_ENABLED)) { ... }
 */
export async function isFlagEnabled(flag: FlagKey): Promise<boolean> {
  return getFlag<boolean>(flag, false);
}
