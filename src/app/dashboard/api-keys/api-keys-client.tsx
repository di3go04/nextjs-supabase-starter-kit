"use client";

import { useEffect, useState } from "react";
import { Key, Plus, Copy, Check, Trash2, Ban, AlertCircle } from "lucide-react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  createApiKey, listApiKeys, revokeApiKey, deleteApiKey,
  type ApiKey, type ApiKeyWithSecret,
} from "@/app/actions/api-keys";
import { toast } from "sonner";

export function ApiKeysClient() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [creating, setCreating] = useState(false);
  const [newKey, setNewKey] = useState<ApiKeyWithSecret | null>(null);
  const [copied, setCopied] = useState(false);

  const load = async () => {
    const list = await listApiKeys();
    setKeys(list);
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const handleCreate = async () => {
    if (!newKeyName.trim()) return;
    setCreating(true);
    const result = await createApiKey(newKeyName.trim());
    setCreating(false);

    if ("error" in result) {
      toast.error(result.error);
      return;
    }

    setNewKey(result);
    setNewKeyName("");
    setDialogOpen(false);
    toast.success("API key creada");
    load();
  };

  const handleRevoke = async (id: string) => {
    const res = await revokeApiKey(id);
    if (res.ok) { toast.success("Key revocada"); load(); }
    else toast.error(res.error ?? "Error");
  };

  const handleDelete = async (id: string) => {
    const res = await deleteApiKey(id);
    if (res.ok) { toast.success("Key eliminada"); load(); }
    else toast.error(res.error ?? "Error");
  };

  const copyKey = () => {
    if (!newKey) return;
    navigator.clipboard.writeText(newKey.secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Key className="h-7 w-7" /> API Keys
          </h1>
          <p className="text-muted-foreground mt-1">
            Genera tokens para acceder a la API pública de tu cuenta.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Nueva key</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear nueva API key</DialogTitle>
              <DialogDescription>
                Dale un nombre descriptivo. El plaintext solo se mostrará una vez.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 py-2">
              <Label htmlFor="key-name">Nombre</Label>
              <Input
                id="key-name"
                placeholder="Producción, Testing, CI/CD..."
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              />
            </div>
            <DialogFooter>
              <Button onClick={handleCreate} disabled={creating || !newKeyName.trim()}>
                {creating ? "Creando..." : "Crear key"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Modal de nueva key creada */}
      {newKey && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-3">
              <p className="font-semibold">¡Copia tu API key ahora! No la volverás a ver.</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-muted rounded text-xs break-all font-mono">
                  {newKey.secret}
                </code>
                <Button size="icon" variant="outline" onClick={copyKey}>
                  {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setNewKey(null)}>
                Cerrar
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Lista de keys */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tus API keys ({keys.length})</CardTitle>
          <CardDescription>
            Las keys revocadas dejan de funcionar inmediatamente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Cargando...</p>
          ) : keys.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Key className="mx-auto h-12 w-12 opacity-30 mb-2" />
              <p className="text-sm">No tienes API keys todavía.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Prefix</TableHead>
                  <TableHead>Creada</TableHead>
                  <TableHead>Último uso</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keys.map((k) => (
                  <TableRow key={k.id}>
                    <TableCell className="font-medium">{k.name}</TableCell>
                    <TableCell><code className="text-xs">{k.key_prefix}...</code></TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(k.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {k.last_used_at ? new Date(k.last_used_at).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell>
                      {k.revoked_at ? (
                        <Badge variant="secondary" className="bg-rose-100 text-rose-700">Revocada</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">Activa</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {!k.revoked_at && (
                        <Button size="icon" variant="ghost" onClick={() => handleRevoke(k.id)} title="Revocar">
                          <Ban className="h-4 w-4" />
                        </Button>
                      )}
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(k.id)} title="Eliminar">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Ejemplo de uso */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cómo usar tu API key</CardTitle>
          <CardDescription>Ejemplo de llamada a la API pública.</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-muted p-3 rounded overflow-x-auto"><code>{`curl -X GET https://your-app.com/api/v1/me \\
  -H "Authorization: Bearer sk_live_xxxxxxxx"`}</code></pre>
        </CardContent>
      </Card>
    </div>
  );
}
