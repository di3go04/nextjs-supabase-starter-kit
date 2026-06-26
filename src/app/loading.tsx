import { Loader2 } from "lucide-react";

/**
 * Loading UI a nivel de ruta.
 * Se muestra mientras Server Components cargan.
 */
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Cargando…</p>
      </div>
    </div>
  );
}
