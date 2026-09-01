import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/modules/admin/store/data/datasources/supabase/supabase-server.client";
import { requireAuth } from "@/core/helpers/require-auth";
import { calcularCashbackGanado } from "@/core/helpers/cashback/calcular-cashback";

// GET — lista cotizaciones con filtros opcionales
export async function GET(req: NextRequest) {
  const unauth = await requireAuth(req);
  if (unauth) return unauth;

  try {
    const supabase = getSupabaseServerClient();
    const searchParams = req.nextUrl.searchParams;
    const clienteId = searchParams.get("cliente_id");
    const status = searchParams.get("status");

    let query = supabase
      .from("cotizaciones")
      .select(
        `
        id,
        numero_orden,
        cliente_id,
        cliente_nombre,
        status,
        subtotal,
        descuento,
        cashback_canjeado,
        total,
        expira_at,
        created_at,
        updated_at,
        clientes (
          nombre,
          apellido,
          email
        )
      `,
      )
      .order("created_at", { ascending: false });

    if (clienteId) query = query.eq("cliente_id", clienteId);
    if (status) query = query.eq("status", status);

    const { data, error } = await query;

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener cotizaciones" },
      { status: 500 },
    );
  }
}

// POST — guarda carrito como cotización
export async function POST(req: NextRequest) {
  const unauth = await requireAuth(req);
  if (unauth) return unauth;

  try {
    const body = await req.json();
    const {
      cliente_id,
      cliente_nombre,
      lineas,
      cupon_global,
      subtotal,
      descuento,
      cashback_canjeado = 0,
      total,
      direccion_id,
      direccion_entrega,
      fecha_entrega,
    } = body;

    if (!cliente_nombre?.trim()) {
      return NextResponse.json(
        { error: "El nombre del cliente es requerido" },
        { status: 400 },
      );
    }
    if (!lineas?.length) {
      return NextResponse.json(
        { error: "La cotización debe tener al menos un producto" },
        { status: 400 },
      );
    }

    const supabase = getSupabaseServerClient();
    const expira_at = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    ).toISOString();

    // Crea la cotización
    const { data: cotizacion, error: cotError } = await supabase
      .from("cotizaciones")
      .insert({
        cliente_id: cliente_id || null,
        cliente_nombre: cliente_nombre.trim(),
        status: "cotizacion",
        subtotal,
        descuento,
        cashback_canjeado,
        total,
        cupon_global: cupon_global || null,
        direccion_id: direccion_id || null,
        direccion_entrega: direccion_entrega || null,
        fecha_entrega: fecha_entrega || null,
        expira_at,
      })
      .select()
      .single();

    if (cotError) {
      return NextResponse.json({ error: cotError.message }, { status: 500 });
    }

    // Inserta líneas
    const lineasData = lineas.map((l: any) => ({
      cotizacion_id: cotizacion.id,
      producto_id: l.product.id,
      clave: l.product.clave,
      descripcion: l.product.descripcion,
      marca: l.product.marca,
      cantidad: l.cantidad,
      precio_unitario: l.precioFinal,
      descuento: l.descuento,
      total: l.total,
      cupon: l.cupon || null,
      detalle: l.detalleServicio || null,
    }));

    let { error: lineasError } = await supabase
      .from("cotizacion_lineas")
      .insert(lineasData);

    // Si la columna `detalle` todavía no existe (falta correr la
    // migración), reintenta sin ella en vez de perder toda la cotización.
    if (lineasError?.message?.includes("detalle")) {
      const lineasSinDetalle = lineasData.map((linea: Record<string, unknown>) => {
        const resto: Record<string, unknown> = { ...linea };
        delete resto.detalle;
        return resto;
      });
      ({ error: lineasError } = await supabase
        .from("cotizacion_lineas")
        .insert(lineasSinDetalle));
    }

    if (lineasError) {
      return NextResponse.json({ error: lineasError.message }, { status: 500 });
    }

    // Si hay cashback canjeado, registrarlo
    if (cashback_canjeado > 0 && cliente_id) {
      await supabase.from("cashback").insert({
        cliente_id,
        cotizacion_id: cotizacion.id,
        monto: cashback_canjeado,
        tipo: "usado",
      });
    }

    // Incrementa el contador de usos de cada cupón usado (global o por línea)
    const codigosUsados = new Set<string>();
    if (cupon_global?.codigo) codigosUsados.add(cupon_global.codigo);
    for (const l of lineas) {
      if (l.cupon?.codigo) codigosUsados.add(l.cupon.codigo);
    }

    for (const codigo of codigosUsados) {
      const { data: cupon } = await supabase
        .from("cupones")
        .select("id, usos_actuales")
        .eq("codigo", codigo)
        .single();

      if (cupon) {
        await supabase
          .from("cupones")
          .update({ usos_actuales: (cupon.usos_actuales ?? 0) + 1 })
          .eq("id", cupon.id);
      }
    }

    return NextResponse.json(cotizacion, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error al guardar cotización" },
      { status: 500 },
    );
  }
}
