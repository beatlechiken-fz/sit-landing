import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { verifyClientToken } from "@/core/helpers/auth/client-session";

const intlMiddleware = createMiddleware(routing);

const PROTECTED_API_PATHS = [
  "/api/grupos",
  "/api/cupones",
  "/api/revalidate",
  "/api/products",
  "/api/graphql",
  "/api/clientes",
  "/api/deals",
];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1 — NextAuth nunca interceptar
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // 2 — API portal cliente
  if (pathname.startsWith("/api/my-sit")) {
    return NextResponse.next();
  }

  // 3 — API routes del admin
  const isProtectedApi = PROTECTED_API_PATHS.some((path) =>
    pathname.startsWith(path),
  );

  if (isProtectedApi) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Normaliza quitando el locale
  const locale = pathname.split("/")[1];
  const hasLocale = ["es", "en"].includes(locale);
  const normalizedPath = hasLocale
    ? pathname.replace(`/${locale}`, "")
    : pathname;

  // 4 — Login del cliente — /my-sit es público
  if (normalizedPath === "/my-sit") {
    return intlMiddleware(req);
  }

  // 5 — Dashboard del cliente — requiere sesión
  if (normalizedPath.startsWith("/my-sit/dashboard")) {
    const cookieToken = req.cookies.get("sit_client_session")?.value;
    const session = cookieToken ? await verifyClientToken(cookieToken) : null;
    const prefix = hasLocale ? `/${locale}` : "";

    if (!session) {
      return NextResponse.redirect(new URL(`${prefix}/my-sit`, req.url));
    }

    // Contraseña temporal (alta o reset por admin) — bloquea todo el
    // dashboard hasta que la cambien, sin importar qué URL intenten abrir.
    if (
      session.debeCambiarPassword &&
      normalizedPath !== "/my-sit/dashboard/cambiar-password"
    ) {
      return NextResponse.redirect(
        new URL(`${prefix}/my-sit/dashboard/cambiar-password`, req.url),
      );
    }
  }

  // 6 — Páginas admin
  if (normalizedPath.startsWith("/admin/dashboard")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.redirect(new URL(`/${locale}/admin`, req.url));
    }
  }

  // 7 — Intl para el resto
  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
