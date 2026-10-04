"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LoaderCircle, LockKeyhole, Mail, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup" | "magiclink";

export default function LoginForm({ linkExpired = false }: { linkExpired?: boolean }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function getClient() {
    const client = createClient();
    if (!client) setError("ReplyKit is connecting to Supabase. If you haven't configured .env.local yet, please set your Supabase credentials.");
    return client;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    const client = getClient();
    if (!client) { setBusy(false); return; }

    const emailRedirectTo = `${window.location.origin}/auth/callback?next=/generate`;

    if (mode === "magiclink") {
      const { error: authError } = await client.auth.signInWithOtp({
        email,
        options: { emailRedirectTo },
      });
      setBusy(false);
      if (authError) {
        setError(authError.message);
      } else {
        setSent(true);
      }
      return;
    }

    if (mode === "signup") {
      const { data, error: authError } = await client.auth.signUp({
        email,
        password,
        options: { emailRedirectTo },
      });
      setBusy(false);
      if (authError) {
        setError(authError.message);
      } else if (data.session) {
        router.push("/generate");
        window.location.assign("/generate");
      } else {
        setSent(true);
      }
      return;
    }

    // signin with password
    const { data, error: authError } = await client.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (authError) {
      setError(authError.message);
    } else {
      router.push("/generate");
      window.location.assign("/generate");
    }
  }

  async function handleGoogleSignIn() {
    setError("");
    setBusy(true);
    const client = getClient();
    if (!client) { setBusy(false); return; }
    const redirectTo = `${window.location.origin}/auth/callback?next=/generate`;
    const { error: authError } = await client.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (authError) {
      setBusy(false);
      setError(authError.message);
    }
  }

  if (sent) {
    return (
      <div className="notice success-notice">
        <Mail size={15} />
        <span>
          Check your inbox at <strong>{email}</strong>. Click the confirmation link to sign in and you will be redirected straight to your work workspace.
        </span>
      </div>
    );
  }

  return (
    <>
      {linkExpired && (
        <div className="notice error-notice" style={{ marginBottom: 13 }}>
          That sign-in link has expired or was already used. You can request a fresh link or sign in with your password below.
        </div>
      )}

      <div className="auth-mode-switch" role="tablist" aria-label="Account access">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "signin"}
          className={mode === "signin" ? "auth-mode active" : "auth-mode"}
          onClick={() => { setMode("signin"); setError(""); }}
        >
          Sign in
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "signup"}
          className={mode === "signup" ? "auth-mode active" : "auth-mode"}
          onClick={() => { setMode("signup"); setError(""); }}
        >
          Create account
        </button>
      </div>

      <button className="google-button" type="button" disabled={busy} onClick={handleGoogleSignIn}>
        {busy ? <LoaderCircle size={15} className="spin" /> : <GoogleMark />} Continue with Google
      </button>

      <div className="auth-divider"><span>or use email</span></div>

      <form onSubmit={handleSubmit}>
        <label className="field-label" htmlFor="email">Email address</label>
        <input
          className="input"
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@yourbusiness.com"
        />

        {mode !== "magiclink" && (
          <>
            <label className="field-label" htmlFor="password" style={{ marginTop: 14 }}>Password</label>
            <input
              className="input"
              id="password"
              type="password"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              minLength={8}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
            />
          </>
        )}

        {error && <div className="notice error-notice" style={{ marginTop: 12 }}>{error}</div>}

        <button className="primary-button" type="submit" disabled={busy} style={{ width: "100%", marginTop: 16 }}>
          {busy ? (
            <LoaderCircle size={14} className="spin" />
          ) : mode === "signup" ? (
            <LockKeyhole size={14} />
          ) : (
            <Mail size={14} />
          )}
          {mode === "signup"
            ? "Create my account"
            : mode === "magiclink"
            ? "Send me a sign-in link"
            : "Sign in with email"}
          <ArrowRight size={13} />
        </button>
      </form>

      <div style={{ marginTop: 14, textAlign: "center" }}>
        {mode === "magiclink" ? (
          <button
            type="button"
            className="text-link"
            style={{ border: "none", background: "none", cursor: "pointer", fontSize: 11 }}
            onClick={() => { setMode("signin"); setError(""); }}
          >
            Prefer password? Sign in with password instead
          </button>
        ) : (
          <button
            type="button"
            className="text-link"
            style={{ border: "none", background: "none", cursor: "pointer", fontSize: 11 }}
            onClick={() => { setMode("magiclink"); setError(""); }}
          >
            Email me a sign-in link instead (no password needed)
          </button>
        )}
      </div>

      <p className="auth-footnote">
        {mode === "signup"
          ? "New here? The same link creates your account and redirects you to start work."
          : mode === "magiclink"
          ? "New here? The same link creates your account."
          : "Sign in to access your reply generator workspace."}
      </p>
    </>
  );
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" className="google-mark" viewBox="0 0 18 18" width="16" height="16">
      <path fill="#4285F4" d="M17.64 9.205c0-.638-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.797 2.716v2.258h2.909c1.702-1.567 2.684-3.875 2.684-6.614Z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.807 5.956-2.181l-2.909-2.258c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.582-5.038-3.71H.955v2.33A9 9 0 0 0 9 18Z" />
      <path fill="#FBBC05" d="M3.962 10.711A5.41 5.41 0 0 1 3.681 9c0-.594.102-1.171.281-1.711V4.959H.955A9 9 0 0 0 0 9c0 1.45.347 2.823.955 4.041l3.007-2.33Z" />
      <path fill="#EA4335" d="M9 3.579c1.322 0 2.508.454 3.443 1.346l2.581-2.581C13.463.892 11.426 0 9 0A9 9 0 0 0 .955 4.959l3.007 2.33C4.672 5.161 6.656 3.579 9 3.579Z" />
    </svg>
  );
}
