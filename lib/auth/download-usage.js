import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xlgzppdd";

function formatIndianStandardTime(value = new Date()) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
    timeZoneName: "short",
  }).format(value);
}

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
        downloaded_at_ist: formatIndianStandardTime(),
        time_zone: "Indian Standard Time (Asia/Kolkata, UTC+05:30)",
      }),
      keepalive: true,
    });
  } catch {
    // Analytics must never prevent a download.
  }
}
