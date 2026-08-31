/**
 * El email es opcional al crear un cliente, pero la columna `clientes.email`
 * es NOT NULL/UNIQUE en la base de datos. Cuando no se da un email real,
 * generamos uno interno con este dominio reservado para satisfacer esa
 * restricción sin bloquear la creación del cliente. Nunca se usa para
 * enviar correos y la UI lo muestra como "Sin correo".
 */
export const PLACEHOLDER_EMAIL_DOMAIN = "sin-correo.sitmorelia.local";

export function buildPlaceholderEmail(): string {
  return `sin-correo-${crypto.randomUUID()}@${PLACEHOLDER_EMAIL_DOMAIN}`;
}

export function isPlaceholderEmail(email: string | null | undefined): boolean {
  return !!email && email.endsWith(`@${PLACEHOLDER_EMAIL_DOMAIN}`);
}
