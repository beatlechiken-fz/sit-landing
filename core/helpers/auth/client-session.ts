import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.CLIENT_JWT_SECRET ?? "fallback_secret_change_me",
);

const COOKIE_NAME = "sit_client_session";
const MAX_AGE = 60 * 60 * 8; // 8 horas

export interface ClientSession {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  debeCambiarPassword: boolean;
}

// ── Crear token ───────────────────────────────
export async function createClientToken(
  session: ClientSession,
): Promise<string> {
  return new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(SECRET);
}

// ── Verificar token ───────────────────────────
export async function verifyClientToken(
  token: string,
): Promise<ClientSession | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as ClientSession;
  } catch {
    return null;
  }
}

// ── Leer sesión desde cookie (Server Component) ──
export async function getClientSession(): Promise<ClientSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyClientToken(token);
}

// ── Nombres de cookie exportados ─────────────
export { COOKIE_NAME, MAX_AGE };
