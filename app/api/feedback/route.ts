import { NextResponse } from "next/server";
import clientPromise from "@/core/helpers/mongodb";
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

  const client = await clientPromise;
  const db = client.db("sit");

  await db.collection("evaluations").insertOne({
    ratings: body.ratings,
    comments: body.comments || "",
    ip,
    createdAt: new Date(),
  });

  return NextResponse.json({ success: true });
}
