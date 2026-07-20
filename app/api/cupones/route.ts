import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/modules/admin/store/data/datasources/supabase/supabase-server.client";
import { requireAuth } from "@/core/helpers/require-auth";

// GET — lista todos los cupones
export async function GET(req: NextRequest) {
  try {
    const unauth = await requireAuth(req);
    if (unauth) return unauth;

    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from("cupones")
      .select("*")
      .order("created_at", { ascending: false });

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener cupones" },
      { status: 500 },
    );
  }
}

// POST — crea nuevo cupón
export async function POST(req: NextRequest) {
  try {
    const unauth = await requireAuth(req);
    if (unauth) return unauth;

    const body = await req.json();
    const { codigo, descuento, tipo, expira_at, cliente_id, max_usos } = body;

    if (!codigo?.trim()) {
      return NextResponse.json(
        { error: "El código es requerido" },
        { status: 400 },
      );
    }
    if (!descuento || isNaN(Number(descuento)) || Number(descuento) <= 0) {
      return NextResponse.json(
        { error: "El descuento debe ser mayor a 0" },
        { status: 400 },
      );
    }
    if (!["porcentaje", "fijo"].includes(tipo)) {
      return NextResponse.json({ error: "Tipo inválido" }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from("cupones")
      .insert({
        codigo: codigo.trim().toUpperCase(),
        descuento: Number(descuento),
        tipo,
        activo: true,
        expira_at: expira_at || null,
        cliente_id: cliente_id || null,
        max_usos: max_usos ? Number(max_usos) : null,
        usos_actuales: 0,
      })
      .select()
      .single();

    if (error) {
      const msg = error.message.includes("unique")
        ? "Ya existe un cupón con ese código"
        : error.message;
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error al crear cupón" },
      { status: 500 },
    );
  }
}
