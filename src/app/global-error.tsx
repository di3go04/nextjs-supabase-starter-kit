"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

/**
 * Error boundary global — captura errores que escapan a los error.tsx de ruta
 * (ej. errores en el root layout).
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
     
    console.error("[global error]", error);
  }, [error]);

  return (
    <html lang="es">
      <body className="bg-background text-foreground antialiased">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Error crítico</h2>
              <p className="text-muted-foreground text-sm">
                {error.message || "La aplicación encontró un error inesperado."}
              </p>
            </div>
            <Button onClick={reset}>Recargar aplicación</Button>
          </div>
        </div>
      </body>
    </html>
  );
}
