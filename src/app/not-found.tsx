import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <p className="text-8xl font-bold bg-gradient-to-r from-primary to-primary/40 bg-clip-text text-transparent">
          404
        </p>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Página no encontrada</h1>
          <p className="text-muted-foreground">
            La página que buscas no existe o fue movida.
          </p>
        </div>
        <div className="flex gap-2 justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" /> Volver al inicio
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard">
              <Search className="mr-2 h-4 w-4" /> Ir al dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
