import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/modules/admin/store/data/datasources/supabase/supabase-server.client";
import { requireAuth } from "@/core/helpers/require-auth";

type Params = { params: Promise<{ id: string }> };

// POST — registra un pago del cliente contra el total de la orden
export async function POST(req: NextRequest, { params }: Params) {
  const unauth = await requireAuth(req);
  if (unauth) return unauth;

  try {
    const { id } = await params;
    const { concepto, monto } = await req.json();
    const supabase = getSupabaseServerClient();

    if (!concepto?.trim()) {
      return NextResponse.json(
        { error: "El concepto es requerido" },
        { status: 400 },
      );
    }

    const montoNum = Number(monto);
    if (!monto || isNaN(montoNum) || montoNum <= 0) {
      return NextResponse.json(
        { error: "El monto debe ser mayor a 0" },
        { status: 400 },
      );
    }

    // Trae el total de la orden y lo ya pagado, para no rebasar el restante
    const { data: cotizacion, error: fetchError } = await supabase
      .from("cotizaciones")
      .select("total")
      .eq("id", id)
      .single();

    if (fetchError || !cotizacion) {
      return NextResponse.json(
        { error: "Orden no encontrada" },
        { status: 404 },
      );
    }

    const { data: pagosPrevios, error: pagosError } = await supabase
      .from("cotizacion_pagos")
      .select("monto")
      .eq("cotizacion_id", id);

    if (pagosError)
      return NextResponse.json(
        { error: pagosError.message },
        { status: 500 },
      );

    const totalPagado = (pagosPrevios ?? []).reduce(
      (acc, p) => acc + Number(p.monto),
      0,
    );
    const restante = Math.round((cotizacion.total - totalPagado) * 100) / 100;

    if (montoNum > restante) {
      return NextResponse.json(
        {
          error: `El pago excede el restante (${restante.toFixed(2)})`,
        },
        { status: 400 },
      );
    }

    const { data: pago, error } = await supabase
      .from("cotizacion_pagos")
      .insert({
        cotizacion_id: id,
        concepto: concepto.trim(),
        monto: montoNum,
      })
      .select()
      .single();

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(pago, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error al registrar el pago" },
      { status: 500 },
    );
  }
}
