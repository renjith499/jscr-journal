"use client";

import { LogIn, UserRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createBrowserSupabaseClient, isAuthConfigured } from "@/lib/supabase/browser";

export function AuthButton({ mobile = false, onNavigate }) {
  const [email, setEmail] = useState("");
  const configured = isAuthConfigured();

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) return undefined;
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (active) setEmail(data.user?.email || "");
    }).catch(() => {});
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email || "");
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  if (!configured) return null;
  return (
    <Link
      href={email ? "/account" : "/auth"}
      onClick={onNavigate}
      className={mobile
        ? "flex items-center justify-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold dark:border-slate-700"
        : "inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2.5 text-sm font-bold text-primary transition hover:border-accent hover:text-accent dark:border-slate-700 dark:text-white"}
      title={email || "Register or sign in"}
    >
      {email ? <UserRound size={18} /> : <LogIn size={18} />}
      {email ? "Account" : "Register / Sign in"}
    </Link>
  );
}
