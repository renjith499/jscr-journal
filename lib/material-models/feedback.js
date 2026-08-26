const FORMSPREE_ENDPOINT = "https://formspree.io/f/xlgzppdd";

async function post(payload) {
  const response = await fetch(FORMSPREE_ENDPOINT, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Feedback submission failed.");
}

export function submitMaterialUsageEmail(email, usageNote, source) {
  return post({
    _subject: `JSCR Material Models - ${source || "Download"}`,
    source: source || "Material Models",
    email,
    usage_note: usageNote || "Not provided",
  });
}

export function submitMaterialFeedback(feedback, email, source) {
  return post({
    _subject: "JSCR Material Models - Feedback",
    source: source || "Material Models",
    email: email || "Not provided",
    feedback,
  });
}
