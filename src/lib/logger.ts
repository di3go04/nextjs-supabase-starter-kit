import pino, { type LoggerOptions } from "pino";

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
const isTest = process.env.NODE_ENV === "test";

// En tests, silenciar logs para no romper stdout
// En dev, usar pino-pretty si está disponible
// En prod, JSON plano (Vercel/Datadog lo parsean)
const options: LoggerOptions = {
  level: process.env.LOG_LEVEL ?? (isProd ? "info" : isTest ? "silent" : "debug"),
  base: {
    service: "starter-kit",
    env: process.env.NODE_ENV,
  },
  formatters: {
    level: (label) => ({ level: label }),
  },
};

// Solo intentar usar pino-pretty en dev (no en test, no en prod)
if (!isProd && !isTest) {
  try {
    // Dynamic import para que no rompa si pino-pretty no está instalado
    options.transport = {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "HH:MM:ss",
        ignore: "pid,hostname,service,env",
      },
    };
  } catch {
    // pino-pretty no instalado, usar JSON plano
  }
}

export const logger = pino(options);

/**
 * Helper para logging con contexto de request.
 * Uso: const log = logger.child({ requestId, userId });
 *      log.info({ msg: "user logged in" });
 */
export function createLogger(context: Record<string, unknown>) {
  return logger.child(context);
}
