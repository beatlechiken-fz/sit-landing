import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/modules/admin/store/data/datasources/supabase/supabase-server.client";
import { rateLimit } from "@/core/helpers/rate-limit";
import { validateFeedback } from "@/core/helpers/validate-feedback";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

  // 🚫 Rate limit
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // 🚫 Validación
  if (!validateFeedback(body)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();

  const { error } = await supabase.from("evaluaciones").insert({
    ratings: body.ratings,
    comentarios: body.comments || "",
    ip,
  });

  if (error) {
    return NextResponse.json(
      { error: "Could not save feedback" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
