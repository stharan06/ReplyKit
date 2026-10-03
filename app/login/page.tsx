import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check, HeartHandshake, MessageCircle } from "lucide-react";
import LoginForm from "@/components/login-form";

export const metadata: Metadata = { title: "Sign in or create account", description: "Sign in to ReplyKit or create a free account to write thoughtful customer review replies." };

type PageProps = { searchParams: Promise<{ error?: string }> };

export default async function LoginPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return (
    <main className="login-page">
      <section className="login-side">
        <Link className="brand" href="/"><span className="brand-mark"><MessageCircle size={17} /></span><span>replykit</span></Link>
        <div className="login-side-copy"><div className="eyebrow">Your customers took the time to write</div><h1>Let them know you read every word.</h1><p>ReplyKit helps you turn kind words, honest feedback, and tough moments into replies that sound like you.</p></div>
        <div className="login-decoration"><span className="avatar-stack"><span>A</span><span>M</span><span>R</span></span><span><HeartHandshake size={12} style={{ verticalAlign: "-2px", marginRight: 5 }} /> Made for independent businesses</span></div>
      </section>
      <section className="login-form-side">
        <div className="login-box">
          <Link className="text-link" href="/"><ArrowLeft size={13} /> Back to home</Link>
          <div style={{ height: 28 }} />
          <h2>Welcome to ReplyKit</h2>
          <p>Sign in to your workspace or create a free account to get started.</p>
          <LoginForm linkExpired={params.error === "link"} />
          <div className="login-disclaimer"><Check size={10} style={{ verticalAlign: "-2px", marginRight: 4 }} /> Your replies stay private to your account.</div>
        </div>
      </section>
    </main>
  );
}
