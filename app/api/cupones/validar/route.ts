import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/modules/admin/store/data/datasources/supabase/supabase-server.client";

// ─────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────
export interface CuponValido {
  codigo: string;
  descuento: number;
  tipo: "porcentaje" | "fijo";
}

export interface CuponError {
  error: string;
}

export type CuponResponse = CuponValido | CuponError;

// ─────────────────────────────────────────────
// POST /api/cupones/validar
// Body: { codigo: string, cliente_id?: string | null }
// ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const codigo = (body?.codigo as string)?.trim().toUpperCase();
    const clienteId = (body?.cliente_id as string | null) ?? null;

    if (!codigo) {
      return NextResponse.json(
        { error: "El código del cupón es requerido" },
        { status: 400 },
      );
    }

    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from("cupones")
      .select(
        "codigo, descuento, tipo, activo, expira_at, cliente_id, max_usos, usos_actuales",
      )
      .eq("codigo", codigo)
      .single();

    // No existe
    if (error || !data) {
      return NextResponse.json(
        { error: "Cupón no encontrado" },
        { status: 404 },
      );
    }

    // Inactivo
    if (!data.activo) {
      return NextResponse.json(
        { error: "Este cupón ya no está activo" },
        { status: 400 },
      );
    }

    // Expirado
    if (data.expira_at && new Date(data.expira_at) < new Date()) {
      return NextResponse.json(
        { error: "Este cupón ha expirado" },
        { status: 400 },
      );
    }

    // Exclusivo de otro cliente
    if (data.cliente_id && data.cliente_id !== clienteId) {
      return NextResponse.json(
        { error: "Este cupón no está disponible para este cliente" },
        { status: 400 },
      );
    }

    // Límite de usos alcanzado
    if (data.max_usos !== null && data.usos_actuales >= data.max_usos) {
      return NextResponse.json(
        { error: "Este cupón alcanzó su límite de usos" },
        { status: 400 },
      );
    }

    // Válido
    return NextResponse.json({
      codigo: data.codigo,
      descuento: Number(data.descuento),
      tipo: data.tipo as "porcentaje" | "fijo",
    } satisfies CuponValido);
  } catch {
    return NextResponse.json(
      { error: "Error al validar el cupón" },
      { status: 500 },
    );
  }
}
