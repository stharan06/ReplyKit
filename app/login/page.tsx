import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Check, HeartHandshake, MessageCircle } from "lucide-react";
import LoginForm from "@/components/login-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Sign in or create account",
  description: "Sign in to ReplyKit or create a free account to write thoughtful customer review replies.",
};

type PageProps = { searchParams: Promise<{ error?: string }> };

export default async function LoginPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const supabase = await createClient();
  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) redirect("/generate");
  }

  return (
    <main className="login-page">
      <section className="login-side">
        <Link className="brand" href="/">
          <span className="brand-mark"><MessageCircle size={17} /></span>
          <span>replykit</span>
        </Link>
        <div className="login-side-copy">
          <div className="eyebrow">Your customers took the time to write</div>
          <h1>Let them know you read every word.</h1>
          <p>ReplyKit helps you turn kind words, honest feedback, and tough moments into replies that sound like you.</p>
        </div>
        <div className="login-decoration">
          <span className="brand-mark" style={{ width: 26, height: 26, borderRadius: 8 }}>
            <MessageCircle size={13} />
          </span>
          <span>
            <HeartHandshake size={12} style={{ verticalAlign: "-2px", marginRight: 5 }} /> Made for independent businesses
          </span>
        </div>
      </section>

      <section className="login-form-side">
        <div className="login-box">
          <Link className="text-link" href="/"><ArrowLeft size={13} /> Back to home</Link>
          <div style={{ height: 28 }} />
          <h2>Sign in or create your account</h2>
          <p>New here? The same link creates your account.</p>
          <LoginForm linkExpired={params.error === "link"} />
          <div className="login-disclaimer">
            <Check size={10} style={{ verticalAlign: "-2px", marginRight: 4 }} /> Your replies stay private to your account.
          </div>
          <div style={{ marginTop: 24, textAlign: "center", fontSize: 11, color: "#8e9790", display: "flex", justifyContent: "center", gap: 14 }}>
            <Link href="/pricing">Pricing</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
