"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, LoaderCircle, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm({ linkExpired = false }: { linkExpired?: boolean }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    const supabase = createClient();
    if (!supabase) {
      setError("Add your Supabase URL and anon key to .env.local to enable sign in.");
      setBusy(false);
      return;
    }
    const redirectTo = `${window.location.origin}/auth/callback?next=/generate`;
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });
    setBusy(false);
    if (authError) setError(authError.message);
    else setSent(true);
  }

  if (sent) return <div className="notice success-notice"><Mail size={15} /><span>Check your inbox at <strong>{email}</strong>. Your private sign-in link is on its way.</span></div>;

  return <>
    {linkExpired && <div className="notice error-notice" style={{ marginBottom: 13 }}>That sign-in link has expired or was already used. Request a fresh one below.</div>}
    <form onSubmit={handleSubmit}>
    <label className="field-label" htmlFor="email">Email address</label>
    <input className="input" id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@yourbusiness.com" />
    {error && <div className="notice error-notice" style={{ marginTop: 12 }}>{error}</div>}
    <button className="primary-button" type="submit" disabled={busy}>{busy ? <LoaderCircle size={14} className="spin" /> : <Mail size={14} />} Send me a sign-in link <ArrowRight size={13} /></button>
    </form>
  </>;
}
