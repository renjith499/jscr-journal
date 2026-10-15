import { NextResponse } from "next/server";
import { authorizeAdmin } from "@/lib/supabase/admin";

export async function GET(request) {
  return NextResponse.json({ admin: Boolean(await authorizeAdmin(request)) });
}
