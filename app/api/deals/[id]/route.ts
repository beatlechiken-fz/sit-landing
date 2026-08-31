import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/modules/admin/store/data/datasources/supabase/supabase-server.client";
import { requireAuth } from "@/core/helpers/require-auth";
import { puedeEditarTotal } from "@/modules/admin/store/domain/entities/deal.entity";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const unauth = await requireAuth(req);
  if (unauth) return unauth;

  try {
    const { id } = await params;
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from("cotizaciones")
      .select(
        `
        *,
        clientes (
          id,
          nombre,
          apellido,
          email,
          telefono,
          empresa
        ),
        cotizacion_lineas (*),
        cotizacion_mensajes (
          id,
          origen,
          contenido,
          leido,
          created_at
        )
      `,
      )
      .eq("id", id)
      .order("created_at", {
        ascending: true,
        referencedTable: "cotizacion_mensajes",
      })
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Cotización no encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener cotización" },
      { status: 500 },
    );
  }
}

// PATCH — modifica el total de la orden. Solo mientras está "en_diagnostico"
// (aún no se conoce el costo final del servicio); una vez que avanza a
// cualquier otro status, el total queda congelado.
export async function PATCH(req: NextRequest, { params }: Params) {
  const unauth = await requireAuth(req);
  if (unauth) return unauth;

  try {
    const { id } = await params;
    const { total } = await req.json();
    const supabase = getSupabaseServerClient();

    const totalNum = Number(total);
    if (total === undefined || total === null || isNaN(totalNum) || totalNum < 0) {
      return NextResponse.json(
        { error: "El total debe ser un número mayor o igual a 0" },
        { status: 400 },
      );
    }

    const { data: actual, error: fetchError } = await supabase
      .from("cotizaciones")
      .select("status")
      .eq("id", id)
      .single();

    if (fetchError || !actual) {
      return NextResponse.json(
        { error: "Orden no encontrada" },
        { status: 404 },
      );
    }

    if (!puedeEditarTotal(actual.status)) {
      return NextResponse.json(
        {
          error:
            "El total solo se puede modificar mientras la orden está en diagnóstico",
        },
        { status: 400 },
      );
    }

    const { data: updated, error: updateError } = await supabase
      .from("cotizaciones")
      .update({
        subtotal: totalNum,
        total: totalNum,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 },
      );
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Error al actualizar el total" },
      { status: 500 },
    );
  }
}
