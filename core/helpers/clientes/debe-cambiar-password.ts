/**
 * La columna `clientes.debe_cambiar_password` puede no existir todavía en
 * algunos entornos (falta correr la migración en Supabase). Mientras eso
 * pase, cualquier insert/update/select que la incluya falla por completo
 * con un error de PostgREST — y eso no debe tronar creación de clientes,
 * login, ni cambio de contraseña.
 *
 * Este helper detecta ese error específico para poder reintentar la misma
 * operación sin la columna, en vez de fallar. En cuanto la migración
 * exista en la base de datos, este fallback deja de activarse solo.
 *
 * Migración recomendada (correr una sola vez en el SQL editor de Supabase):
 *   ALTER TABLE public.clientes
 *     ADD COLUMN debe_cambiar_password boolean NOT NULL DEFAULT false;
 */
export function isMissingDebeCambiarPasswordColumnError(
  error: { message?: string } | null | undefined,
): boolean {
  return !!error?.message?.includes("debe_cambiar_password");
}
