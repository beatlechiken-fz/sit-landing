import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/modules/admin/store/data/datasources/supabase/supabase-server.client";
import { requireAuth } from "@/core/helpers/require-auth";

// GET — lista todos los servicios
export async function GET(req: NextRequest) {
  try {
    const unauth = await requireAuth(req);
    if (unauth) return unauth;

    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from("servicios")
      .select("*")
      .order("created_at", { ascending: false });

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener servicios" },
      { status: 500 },
    );
  }
}

// POST — crea nuevo servicio
export async function POST(req: NextRequest) {
  try {
    const unauth = await requireAuth(req);
    if (unauth) return unauth;

    const body = await req.json();
    const { nombre, descripcion, precio } = body;

    if (!nombre?.trim()) {
      return NextResponse.json(
        { error: "El nombre es requerido" },
        { status: 400 },
      );
    }

    // precio vacío/null = sin precio fijo, se define en el carrito
    let precioNum: number | null = null;
    if (precio !== null && precio !== undefined && precio !== "") {
      precioNum = Number(precio);
      if (isNaN(precioNum) || precioNum < 0) {
        return NextResponse.json(
          { error: "El precio debe ser un número mayor o igual a 0" },
          { status: 400 },
        );
      }
    }

    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from("servicios")
      .insert({
        nombre: nombre.trim(),
        descripcion: descripcion?.trim() || nombre.trim(),
        precio: precioNum,
        activo: true,
      })
      .select()
      .single();

    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error al crear servicio" },
      { status: 500 },
    );
  }
}
