import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ApiKeysClient } from "./api-keys-client";

export const dynamic = "force-dynamic";

export default async function ApiKeysPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/dashboard/api-keys");

  return <ApiKeysClient />;
}
