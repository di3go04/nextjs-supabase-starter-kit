"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import { Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/context/user-context";
import { updateProfile, uploadAvatar, type ProfileActionState } from "@/app/actions/profile";

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("common");
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {t("save")}
    </Button>
  );
}

export default function ProfilePage() {
  const t = useTranslations("profile");
  const common = useTranslations("common");
  const { user, refreshProfile } = useUser();
  const [profileState, profileAction] = useActionState<ProfileActionState, FormData>(updateProfile, { ok: false });
  const [avatarState, avatarAction] = useActionState<ProfileActionState, FormData>(uploadAvatar, { ok: false });
  const fileRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fullName = user?.profile?.full_name ?? "";
  const username = user?.profile?.username ?? "";

  useEffect(() => {
    if (profileState.ok) refreshProfile();
    if (avatarState.ok) {
      refreshProfile();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreviewUrl(null);
    }
  }, [profileState.ok, avatarState.ok, refreshProfile]);

  const initials = (user?.profile?.full_name || user?.email || "U")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const avatarUrl = previewUrl ?? user?.profile?.avatar_url ?? undefined;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("avatar.title")}</CardTitle>
          <CardDescription>{t("avatar.desc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={avatarAction} className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatarUrl} alt={initials} />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>

            <div className="space-y-2">
              <Input
                ref={fileRef}
                name="avatar"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setPreviewUrl(URL.createObjectURL(f));
                }}
                className="max-w-xs"
              />
              <Button type="submit" variant="outline" size="sm" disabled={!previewUrl}>
                <Upload className="mr-2 h-4 w-4" /> {t("avatar.upload")}
              </Button>
            </div>
          </form>

          {avatarState.ok && avatarState.message && (
            <Alert className="mt-3">
              <AlertDescription>{avatarState.message}</AlertDescription>
            </Alert>
          )}
          {avatarState.error && (
            <Alert variant="destructive" className="mt-3">
              <AlertDescription>{avatarState.error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("data.title")}</CardTitle>
          <CardDescription>{t("data.desc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={profileAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">{t("data.fullName")}</Label>
              <Input
                id="full_name"
                name="full_name"
                defaultValue={fullName}
                placeholder="Tu nombre"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">{t("data.username")}</Label>
              <Input
                id="username"
                name="username"
                defaultValue={username}
                placeholder="usuario_123"
              />
            </div>

            <div className="space-y-2">
              <Label>{t("data.email")}</Label>
              <Input value={user?.email ?? ""} disabled />
              <p className="text-xs text-muted-foreground">{t("data.emailHint")}</p>
            </div>

            <SubmitButton />
          </form>

          {profileState.ok && profileState.message && (
            <Alert className="mt-3">
              <AlertDescription>{profileState.message}</AlertDescription>
            </Alert>
          )}
          {profileState.error && (
            <Alert variant="destructive" className="mt-3">
              <AlertDescription>{profileState.error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
