"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Plus, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { createTeam, type TeamActionState } from "@/app/actions/teams";
import { toast } from "sonner";

interface Team {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  team_members: Array<{ role: string }>;
  membersCount: number;
}

function CreateButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
      Crear equipo
    </Button>
  );
}

export function TeamsListClient({ teams }: { teams: Team[] }) {
  const [state, formAction] = useActionState<TeamActionState, FormData>(createTeam, { ok: false });

  if (state.ok) {
    toast.success("Equipo creado");
  }
  if (state.error) {
    toast.error(state.error);
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Equipos</h1>
          <p className="text-muted-foreground mt-1">
            Crea organizaciones para colaborar con tu equipo.
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Nuevo equipo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear nuevo equipo</DialogTitle>
              <DialogDescription>
                Serás el owner del equipo. Podrás invitar miembros después.
              </DialogDescription>
            </DialogHeader>
            <form action={formAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" name="name" placeholder="Acme Inc." required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" name="slug" placeholder="acme-inc" required />
                <p className="text-xs text-muted-foreground">
                  Solo minúsculas, números y guiones.
                </p>
              </div>
              <DialogFooter>
                <CreateButton />
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {teams.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">
              No tienes equipos. Crea el primero para empezar a colaborar.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {teams.map((t) => (
            <Link key={t.id} href={`/dashboard/teams/${t.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{t.name}</CardTitle>
                    <Badge variant="secondary">{t.team_members[0]?.role}</Badge>
                  </div>
                  <CardDescription className="font-mono text-xs">@{t.slug}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    {t.membersCount} {t.membersCount === 1 ? "miembro" : "miembros"} ·{" "}
                    Creado {new Date(t.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
