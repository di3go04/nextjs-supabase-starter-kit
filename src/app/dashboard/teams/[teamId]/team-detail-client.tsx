"use client";

import { useActionState } from "react";
import { Mail, UserPlus, Crown, Shield, User as UserIcon } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { inviteToTeam, removeTeamMember, type TeamActionState } from "@/app/actions/teams";
import { toast } from "sonner";

interface Member {
  id: string;
  role: string;
  user_id: string;
  created_at: string;
  profiles: { email: string | null; full_name: string | null; avatar_url: string | null } | null;
}

interface Invitation {
  id: string;
  email: string;
  role: string;
  expires_at: string;
  created_at: string;
}

const ROLE_ICONS: Record<string, typeof Crown> = {
  owner: Crown,
  admin: Shield,
  member: UserIcon,
};

export function TeamDetailClient({
  team,
  members,
  invitations,
  currentUserId,
}: {
  team: { id: string; name: string; slug: string; myRole: string };
  members: Member[];
  invitations: Invitation[];
  currentUserId: string;
}) {
  const [state, formAction] = useActionState<TeamActionState, FormData>(inviteToTeam, { ok: false });

  if (state.ok) toast.success("Invitación enviada");
  if (state.error) toast.error(state.error);

  const canManage = team.myRole === "owner" || team.myRole === "admin";

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{team.name}</h1>
        <p className="text-muted-foreground mt-1 font-mono text-sm">@{team.slug}</p>
        <Badge variant="secondary" className="mt-2">
          Tu rol: {team.myRole}
        </Badge>
      </div>

      {/* Miembros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Miembros ({members.length})</CardTitle>
          <CardDescription>Usuarios con acceso a este equipo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {members.map((m) => {
            const RoleIcon = ROLE_ICONS[m.role] ?? UserIcon;
            const initials = (m.profiles?.full_name || m.profiles?.email || "U")
              .split(" ")
              .map((s) => s[0])
              .slice(0, 2)
              .join("")
              .toUpperCase();
            return (
              <div
                key={m.id}
                className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={m.profiles?.avatar_url ?? undefined} alt={initials} />
                    <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{m.profiles?.email ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">
                      {m.profiles?.full_name ?? "Sin nombre"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">
                    <RoleIcon className="mr-1 h-3 w-3" /> {m.role}
                  </Badge>
                  {canManage && m.user_id !== currentUserId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={async () => {
                        const res = await removeTeamMember(team.id, m.user_id);
                        if (res.ok) toast.success("Miembro eliminado");
                        else toast.error(res.error ?? "Error");
                      }}
                    >
                      Eliminar
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Invitar */}
      {canManage && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <UserPlus className="h-5 w-5" /> Invitar miembro
            </CardTitle>
            <CardDescription>
              Enviaremos una invitación por email. Expira en 7 días.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="flex flex-col sm:flex-row gap-3 items-end">
              <input type="hidden" name="teamId" value={team.id} />
              <div className="flex-1 w-full space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="colega@empresa.com"
                  required
                />
              </div>
              <div className="w-full sm:w-40 space-y-2">
                <Label htmlFor="role">Rol</Label>
                <Select name="role" defaultValue="member">
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full sm:w-auto">
                <Mail className="mr-2 h-4 w-4" /> Invitar
              </Button>
            </form>

            {invitations.length > 0 && (
              <div className="mt-6 space-y-2">
                <p className="text-xs text-muted-foreground">Invitaciones pendientes:</p>
                {invitations.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between text-sm p-2 rounded-md bg-muted/30"
                  >
                    <span>{inv.email}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{inv.role}</Badge>
                      <span className="text-xs text-muted-foreground">
                        expira {new Date(inv.expires_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
