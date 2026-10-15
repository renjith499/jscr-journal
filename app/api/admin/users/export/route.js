import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { authorizeAdmin } from "@/lib/supabase/admin";

const csvCell = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;

export async function GET(request) {
  if (!(await authorizeAdmin(request))) return NextResponse.json({ error: "Administrator access required." }, { status: 403 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return NextResponse.json({ error: "Server export credentials are not configured." }, { status: 503 });
  const adminClient = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const users = [];
  for (let page = 1; ; page += 1) {
    const { data, error } = await adminClient.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) return NextResponse.json({ error: "Unable to export users." }, { status: 503 });
    users.push(...data.users);
    if (data.users.length < 1000) break;
  }
  const rows = [["email", "email_verified", "registered_at", "last_sign_in_at"], ...users.map((user) => [user.email, Boolean(user.email_confirmed_at), user.created_at, user.last_sign_in_at || ""])];
  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
  return new NextResponse(csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="jscr-users-${new Date().toISOString().slice(0, 10)}.csv"`, "Cache-Control": "no-store" } });
}
