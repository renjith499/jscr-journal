const FORMSPREE_ENDPOINT = "https://formspree.io/f/xlgzppdd";

async function postToFormspree(payload) {
  const response = await fetch(FORMSPREE_ENDPOINT, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Formspree rejected the submission.");
}

export function submitSteelUsageEmail(email, usageNote) {
  return postToFormspree({
    _subject: "JSCR Steel Calculator - Usage Email",
    source: "Steel Calculator tool",
    email,
    usage_note: usageNote || "Not provided",
  });
}

export function submitSteelFeedback(feedbackText, email) {
  return postToFormspree({
    _subject: "JSCR Steel Calculator - Feedback",
    source: "Steel Calculator tool",
    email: email || "Not provided",
    feedback: feedbackText,
  });
}
