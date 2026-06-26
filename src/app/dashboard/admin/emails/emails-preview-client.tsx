"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail } from "lucide-react";

interface Template {
  id: string;
  name: string;
  subject: string;
  html: string;
}

export function EmailsPreviewClient({ templates }: { templates: Template[] }) {
  const [active, setActive] = useState(templates[0]?.id ?? "");
  const current = templates.find((t) => t.id === active);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Mail className="h-7 w-7" /> Email templates
        </h1>
        <p className="text-muted-foreground mt-1">
          Vista previa de las {templates.length} plantillas. Útil para diseñar y debuggear.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Lista */}
        <div className="space-y-2">
          {templates.map((t) => (
            <Button
              key={t.id}
              variant={t.id === active ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setActive(t.id)}
            >
              <span className="truncate">{t.name}</span>
            </Button>
          ))}
        </div>

        {/* Preview */}
        {current && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{current.name}</CardTitle>
                <Badge variant="secondary">{current.subject}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <iframe
                srcDoc={current.html}
                className="w-full h-[600px] rounded border bg-white"
                title={current.name}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
