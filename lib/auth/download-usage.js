import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xlgzppdd";

export async function getVerifiedDownloadUser() {
  const supabase = createBrowserSupabaseClient();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user?.email || !data.user.email_confirmed_at) return null;
    return data.user;
  } catch {
    return null;
  }
}

export async function submitAuthenticatedDownloadUsage({ email, tool, download }) {
  if (!email) return;
  try {
    await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        _subject: `JSCR authenticated download - ${tool}`,
        source: "Authenticated JSCR download",
        email,
        tool,
        download: download || "Tool export",
        downloaded_at_utc: new Date().toISOString(),
      }),
      keepalive: true,
    });
  } catch {
    // Analytics must never prevent a download.
  }
}
