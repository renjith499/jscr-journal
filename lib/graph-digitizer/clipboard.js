// Tab-separated so a paste into Excel/Google Sheets splits into columns automatically.
export async function copyRowsToClipboard(headers, rows) {
  const lines = [headers.join("\t"), ...rows.map((row) => row.map((cell) => (cell === null || cell === undefined ? "" : cell)).join("\t"))];
  await navigator.clipboard.writeText(lines.join("\n"));
}
