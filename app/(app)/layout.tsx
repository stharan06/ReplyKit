import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppShell from "@/components/app-shell";

export default async function PrivateLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  if (!supabase) return <SetupRequired />;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: business } = await supabase.from("businesses").select("name").eq("owner_id", user.id).maybeSingle();
  return <AppShell businessName={business?.name ?? "Your business"} email={user.email ?? ""}>{children}</AppShell>;
}

function SetupRequired() {
  return <main className="login-form-side"><div className="panel setup-card" style={{ maxWidth: 490 }}><div className="eyebrow">One quick setup step</div><h1 className="page-title" style={{ fontSize: 28 }}>Connect your workspace</h1><p className="page-subtitle">Add the Supabase project URL and anon key to <code>.env.local</code>, then restart ReplyKit. You can create a free Supabase project from the dashboard.</p><p className="page-subtitle">The required variable names are in <code>.env.example</code>.</p><a className="text-link" style={{ marginTop: 20 }} href="/">Back to ReplyKit <span>→</span></a></div></main>;
}
