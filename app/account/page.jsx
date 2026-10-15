"use client";

import { Download, LogOut, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) { setLoading(false); return; }
    supabase.auth.getSession().then(async ({ data }) => {
      const currentUser = data.session?.user || null;
      setUser(currentUser);
      if (data.session?.access_token) {
        try {
          const response = await fetch("/api/admin/status", { headers: { Authorization: `Bearer ${data.session.access_token}` } });
          if (response.ok) setAdmin(Boolean((await response.json()).admin));
        } catch {}
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const signOut = async () => {
    await createBrowserSupabaseClient()?.auth.signOut();
    router.push("/");
    router.refresh();
  };
  const exportEmails = async () => {
    setNotice("");
    const { data } = await createBrowserSupabaseClient().auth.getSession();
    try {
      const response = await fetch("/api/admin/users/export", { headers: { Authorization: `Bearer ${data.session?.access_token || ""}` } });
      if (!response.ok) throw new Error((await response.json()).error || "Export failed");
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `jscr-users-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) { setNotice(error.message); }
  };

  if (loading) return <main className="min-h-[50vh] bg-paper px-5 py-16 text-center dark:bg-slate-950">Loading account…</main>;
  if (!user) return <main className="min-h-[50vh] bg-paper px-5 py-16 dark:bg-slate-950"><div className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-900"><h1 className="text-2xl font-extrabold">Account service unavailable or not signed in</h1><p className="mt-3 text-sm text-slate-500">The public research tools are still fully available.</p><a href="/auth" className="mt-5 inline-block rounded-lg bg-primary px-4 py-2.5 font-bold text-white">Register or sign in</a></div></main>;
  return (
    <main className="bg-paper px-5 py-14 dark:bg-slate-950"><div className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-3"><ShieldCheck className="text-accent" /><div><h1 className="text-2xl font-extrabold text-primary dark:text-white">Your account</h1><p className="text-sm text-slate-500">{user.email}</p></div></div>
      <p className="mt-5 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">Email verified: {user.email_confirmed_at ? "Yes" : "Pending"}</p>
      {admin && <section className="mt-6 rounded-lg border border-cyan-200 p-4 dark:border-cyan-900"><h2 className="font-extrabold">Administrator export</h2><p className="mt-1 text-sm text-slate-500">Download registered email addresses and verification status as CSV. This endpoint is protected server-side.</p><button onClick={exportEmails} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white"><Download size={17} />Download user emails</button>{notice && <p className="mt-3 text-sm text-red-600">{notice}</p>}</section>}
      <button onClick={signOut} className="mt-6 inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-bold dark:border-slate-700"><LogOut size={17} />Sign out</button>
    </div></main>
  );
}
