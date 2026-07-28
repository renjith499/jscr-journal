// Posts to the same Formspree endpoint the Submit Paper form uses, tagged
// with a distinct subject so submissions are easy to tell apart in the inbox.
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xlgzppdd";

async function postToFormspree(payload) {
  const response = await fetch(FORMSPREE_ENDPOINT, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Formspree rejected the submission.");
}

export function submitUsageEmail(email, usageNote) {
  return postToFormspree({
    _subject: "JSCR Graph Digitizer - Usage Email",
    source: "Graph Digitizer tool",
    email,
    usage_note: usageNote || "Not provided",
  });
}

export function submitFeedback(feedbackText, email) {
  return postToFormspree({
    _subject: "JSCR Graph Digitizer - Feedback",
    source: "Graph Digitizer tool",
    email: email || "Not provided",
    feedback: feedbackText,
  });
}
