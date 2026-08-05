const FORMSPREE_ENDPOINT = "https://formspree.io/f/xlgzppdd";

async function postToFormspree(payload) {
  const response = await fetch(FORMSPREE_ENDPOINT, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Formspree rejected the submission.");
}

export function submitCDPUsageEmail(email, usageNote) {
  return postToFormspree({
    _subject: "JSCR CDP Calculator - Usage Email",
    source: "CDP Calculator tool",
    email,
    usage_note: usageNote || "Not provided",
  });
}

export function submitCDPFeedback(feedbackText, email) {
  return postToFormspree({
    _subject: "JSCR CDP Calculator - Feedback",
    source: "CDP Calculator tool",
    email: email || "Not provided",
    feedback: feedbackText,
  });
}
