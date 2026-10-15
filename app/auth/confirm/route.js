import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request) {
  const url = new URL(request.url);
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  const next = url.searchParams.get("next") || "/account";
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/account";
  const supabase = await createServerSupabaseClient();
  if (!supabase || !tokenHash || !type) return NextResponse.redirect(new URL("/auth?error=verification", url.origin));
  const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
  return NextResponse.redirect(new URL(error ? "/auth?error=verification" : safeNext, url.origin));
}
