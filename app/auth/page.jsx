"use client";

import { CheckCircle2, LogIn, ShieldCheck, UserPlus } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient, isAuthConfigured } from "@/lib/supabase/browser";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const configured = isAuthConfigured();

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    const supabase = createBrowserSupabaseClient();
    if (!supabase) return setError("Account services are temporarily unavailable. The research tools remain fully accessible.");
    setBusy(true);
    try {
      if (mode === "register") {
        const { error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/confirm` },
        });
        if (authError) throw authError;
        setMessage("Registration received. Check your email and open the verification link before signing in.");
      } else if (mode === "reset") {
        const { error: authError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/account?reset=1`,
        });
        if (authError) throw authError;
        setMessage("If an account exists for this address, a password-reset email has been sent.");
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (authError) throw authError;
        router.push("/account");
        router.refresh();
      }
    } catch (authError) {
      setError(authError?.message || "Account services are temporarily unavailable. Please continue using the public tools and try again later.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="bg-paper px-5 py-14 dark:bg-slate-950">
      <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <div className="flex items-center gap-3"><ShieldCheck className="text-accent" /><h1 className="text-2xl font-extrabold text-primary dark:text-white">JSCR account</h1></div>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Your email address is your username. Existing research tools remain public and continue working if account services are unavailable.</p>
        {!configured ? (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">Registration is being configured. All existing tools remain available without an account.</div>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-3 rounded-lg bg-slate-100 p-1 dark:bg-slate-950">
              {[["register", "Register"], ["login", "Sign in"], ["reset", "Reset"]].map(([key, label]) => <button key={key} type="button" onClick={() => { setMode(key); setError(""); setMessage(""); }} className={`rounded-md px-3 py-2 text-sm font-bold ${mode === key ? "bg-primary text-white" : "text-slate-500"}`}>{label}</button>)}
            </div>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <label className="block"><span className="mb-1.5 block text-sm font-bold">Email address</span><input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-accent dark:border-slate-700 dark:bg-slate-950" /></label>
              {mode !== "reset" && <label className="block"><span className="mb-1.5 block text-sm font-bold">Password</span><input required minLength={8} type="password" autoComplete={mode === "register" ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-accent dark:border-slate-700 dark:bg-slate-950" /><span className="mt-1 block text-xs text-slate-500">Minimum 8 characters. Passwords are securely encrypted and are never visible to JSCR administrators.</span></label>}
              {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">{error}</p>}
              {message && <p className="flex gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100"><CheckCircle2 size={18} className="shrink-0" />{message}</p>}
              <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-bold text-white disabled:opacity-60">{mode === "register" ? <UserPlus size={18} /> : <LogIn size={18} />}{busy ? "Please wait…" : mode === "register" ? "Create account" : mode === "reset" ? "Send reset email" : "Sign in"}</button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
