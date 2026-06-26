import pino from "pino";

/**
 * Logger estructurado para el servidor.
 *
 * En Vercel, los logs salen a stdout y se capturan por Vercel Logs.
 * Para producción seria, configura un transport a Axiom/Datadog/Logflare.
 *
 * En el navegador, pino funciona pero sin transports avanzados.
 * Para capturar errores de cliente, usar Sentry (ver sentry.client.config.ts).
 */

const isProd = process.env.NODE_ENV === "production";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? (isProd ? "info" : "debug"),
  base: {
    service: "starter-kit",
    env: process.env.NODE_ENV,
  },
  formatters: {
    level: (label) => ({ level: label }),
  },
  // En dev, salida pretty. En prod, JSON (Vercel/Datadog lo parsean).
  transport: isProd
    ? undefined
    : {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "HH:MM:ss",
          ignore: "pid,hostname,service,env",
        },
      },
});

/**
 * Helper para logging con contexto de request.
 * Uso: const log = logger.child({ requestId, userId });
 *      log.info({ msg: "user logged in" });
 */
export function createLogger(context: Record<string, unknown>) {
  return logger.child(context);
}
