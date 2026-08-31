import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/modules/admin/store/data/datasources/supabase/supabase-server.client";
import { requireAuth } from "@/core/helpers/require-auth";
import {
  DealStatus,
  DEAL_STATUS_LABELS,
  esStatusTerminal,
} from "@/modules/admin/store/domain/entities/deal.entity";

type Params = { params: Promise<{ id: string; lineaId: string }> };

// PATCH — cambia el precio (total) de una partida ya guardada (producto o
// servicio). El total de la orden se ajusta automáticamente por la
// diferencia, sin tocar descuentos/cashback ya aplicados.
export async function PATCH(req: NextRequest, { params }: Params) {
  const unauth = await requireAuth(req);
  if (unauth) return unauth;

  try {
    const { id, lineaId } = await params;
    const { total } = await req.json();
    const supabase = getSupabaseServerClient();

    const totalNum = Number(total);
    if (total === undefined || total === null || isNaN(totalNum) || totalNum < 0) {
      return NextResponse.json(
        { error: "El total debe ser un número mayor o igual a 0" },
        { status: 400 },
      );
    }

    const { data: cotizacion, error: cotError } = await supabase
      .from("cotizaciones")
      .select("status, subtotal, total")
      .eq("id", id)
      .single();

    if (cotError || !cotizacion) {
      return NextResponse.json(
        { error: "Orden no encontrada" },
        { status: 404 },
      );
    }

    if (esStatusTerminal(cotizacion.status as DealStatus)) {
      return NextResponse.json(
        {
          error: `Esta orden ya está "${DEAL_STATUS_LABELS[cotizacion.status as DealStatus]}" y no se puede modificar`,
        },
        { status: 400 },
      );
    }

    const { data: linea, error: lineaError } = await supabase
      .from("cotizacion_lineas")
      .select("*")
      .eq("id", lineaId)
      .eq("cotizacion_id", id)
      .single();

    if (lineaError || !linea) {
      return NextResponse.json(
        { error: "Partida no encontrada" },
        { status: 404 },
      );
    }

    const delta = Math.round((totalNum - linea.total) * 100) / 100;
    const nuevoTotalOrden = Math.round((cotizacion.total + delta) * 100) / 100;

    if (nuevoTotalOrden < 0) {
      return NextResponse.json(
        { error: "El total de la orden no puede quedar en negativo" },
        { status: 400 },
      );
    }

    // No dejar que el nuevo total quede por debajo de lo ya pagado
    const { data: pagos, error: pagosError } = await supabase
      .from("cotizacion_pagos")
      .select("monto")
      .eq("cotizacion_id", id);

    if (!pagosError && pagos) {
      const totalPagado = pagos.reduce((acc, p) => acc + Number(p.monto), 0);
      if (nuevoTotalOrden < totalPagado) {
        return NextResponse.json(
          {
            error: `El nuevo total (${nuevoTotalOrden.toFixed(2)}) no puede ser menor a lo ya pagado (${totalPagado.toFixed(2)})`,
          },
          { status: 400 },
        );
      }
    }

    const cantidad = linea.cantidad || 1;

    const { data: lineaActualizada, error: updLineaError } = await supabase
      .from("cotizacion_lineas")
      .update({
        total: totalNum,
        precio_unitario: Math.round((totalNum / cantidad) * 100) / 100,
      })
      .eq("id", lineaId)
      .select()
      .single();

    if (updLineaError) {
      return NextResponse.json(
        { error: updLineaError.message },
        { status: 500 },
      );
    }

    const nuevoSubtotal =
      Math.round((cotizacion.subtotal + delta) * 100) / 100;

    const { data: cotizacionActualizada, error: updCotError } = await supabase
      .from("cotizaciones")
      .update({
        subtotal: nuevoSubtotal,
        total: nuevoTotalOrden,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (updCotError) {
      return NextResponse.json(
        { error: updCotError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      linea: lineaActualizada,
      cotizacion: cotizacionActualizada,
    });
  } catch {
    return NextResponse.json(
      { error: "Error al actualizar la partida" },
      { status: 500 },
    );
  }
}
