"use client";

import { LogIn } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { createBrowserSupabaseClient, isAuthConfigured } from "@/lib/supabase/browser";

export function DownloadAccountLogin({ onAuthenticated, required = false }) {
  const [expanded, setExpanded] = useState(required);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  if (!isAuthConfigured()) return null;

  const signIn = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const supabase = createBrowserSupabaseClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (authError) throw authError;
      if (!data.user?.email_confirmed_at) throw new Error("Verify your email before downloading with your account.");
      onAuthenticated(data.user);
    } catch (authError) {
      setError(authError?.message || "Sign-in is temporarily unavailable. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mb-4 rounded-lg border border-cyan-200 bg-cyan-50 p-3 dark:border-cyan-900 dark:bg-cyan-950">
      {!expanded ? <button type="button" onClick={() => setExpanded(true)} className="flex w-full items-center justify-center gap-2 text-sm font-extrabold text-primary dark:text-cyan-100"><LogIn size={17} />Sign in for one-click downloads</button> : (
        <form onSubmit={signIn} className="space-y-2">
          <p className="text-xs font-bold text-primary dark:text-cyan-100">{required ? "Sign in with a verified account to download this material model." : "Verified members are not asked for email or ratings."}</p>
          <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" className="w-full rounded-md border border-cyan-200 bg-white px-3 py-2 text-sm dark:border-cyan-800 dark:bg-slate-950" />
          <input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" className="w-full rounded-md border border-cyan-200 bg-white px-3 py-2 text-sm dark:border-cyan-800 dark:bg-slate-950" />
          {error && <p className="text-xs font-semibold text-red-600">{error}</p>}
          <button disabled={busy} className="w-full rounded-md bg-primary px-3 py-2 text-sm font-bold text-white disabled:opacity-60">{busy ? "Signing in…" : "Sign in and download"}</button>
          <p className="text-center text-xs text-slate-500">No account? <Link href="/auth" className="font-bold text-accent underline">Register and verify your email</Link></p>
        </form>
      )}
    </div>
  );
}
