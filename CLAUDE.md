# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Next.js 16 (App Router, React 19) site for a technology business ("SIT"): a public marketing landing page, an e-commerce/parts catalog, an admin back-office (store, deals/quotes, coupons, clients), and a customer self-service portal ("my-sit"). Bilingual (en/es) via next-intl, with Spanish as the default locale and most domain code/UI copy written in Spanish (cliente, cotización, cupón, etc.) — match that convention when adding backend code.

## Commands

```bash
pnpm dev          # start dev server (localhost:3000)
pnpm build        # production build
pnpm start         # run production build
pnpm lint          # eslint (flat config, eslint-config-next)
```

Package manager is **pnpm** (pnpm-lock.yaml is the lockfile — don't generate npm/yarn locks). There is no test suite configured in this repo.

## Architecture

### Three separate "apps" behind one Next.js router, split by proxy.ts

`proxy.ts` (the Next middleware, matches everything except `_next`/`_vercel`/files) is the single gate for auth and locale routing. Read it before touching any route under `/admin`, `/my-sit`, or `/api`:

- `/api/auth/*` — NextAuth's own routes, never intercepted.
- `/api/my-sit/*` — public entry (login endpoint lives here); no gate at the middleware level, routes do their own auth via `requireClientAuth`.
- Admin API routes (`/api/grupos`, `/api/cupones`, `/api/revalidate`, `/api/products`, `/api/graphql`, `/api/clientes`, `/api/deals`) — gated by a NextAuth JWT (`getToken` + `NEXTAUTH_SECRET`), 401 JSON if absent.
- `/my-sit/dashboard/*` (customer portal pages) — gated by a **separate** JWT stored in the `sit_client_session` cookie, verified with `verifyClientToken` (jose, `CLIENT_JWT_SECRET`). Unauthenticated → redirect to `/my-sit`.
- `/admin/dashboard/*` (admin pages) — gated by NextAuth session; unauthenticated → redirect to `/admin`.
- Everything else goes through `next-intl`'s middleware for locale handling.

So there are **two independent auth systems**: NextAuth (Credentials provider, `admin_users` table in Supabase, bcrypt) for admin, and a custom jose-JWT cookie session for storefront customers. Don't mix their helpers up:
- Admin API routes: `requireAuth(req)` from `core/helpers/require-auth.ts`.
- Customer API routes: `requireClientAuth(req)` from `core/helpers/auth/require-client-auth.ts`.
- Admin server components: `auth()` from `core/helpers/auth.ts`.
- Customer server components: `getClientSession()` from `core/helpers/auth/client-session.ts`.

### Data layer: Supabase is primary, MongoDB is legacy/narrow

Supabase (Postgres) via `@supabase/supabase-js` is the system of record for almost everything: `admin_users`, `clientes`, `cotizaciones` (+`cotizacion_lineas`), `cupones`, `cashback`, and the product `catalogo`. Two clients exist in `modules/admin/store/data/datasources/supabase/`: `supabase-server.client.ts` (service role, used in API routes/datasources) and `supabase-browser.client.ts` (anon key, client components). Most `app/api/**` route handlers talk to Supabase directly with inline queries (see `app/api/clientes/route.ts`, `app/api/deals/route.ts` for the prevailing style: `requireAuth` guard → try/catch → typed Supabase query → `NextResponse.json`).

MongoDB (`core/helpers/mongodb.ts`) is only used by `app/api/feedback/route.ts` (site feedback/evaluations collection) — it is not the general persistence layer, don't default to it for new features.

### GraphQL is scoped to the product catalog only

`app/api/graphql/route.ts` mounts an Apollo Server (via `@as-integrations/next`), gated by the same `requireAuth`. Schema/resolvers (`core/helpers/graphql/schema.ts`, `resolvers.ts`) expose exactly `products`, `product`, `marcas`, `grupos` — nothing else goes through GraphQL. The resolvers delegate into the clean-architecture layer below rather than querying Supabase directly.

### Clean-architecture module for the product catalog

`modules/admin/store/{domain,data,presentation}` is the one module built with explicit layering — use it as the template if extending catalog features:
- `domain/entities` — plain types (Product, ProductFilter, PaginatedResult, etc.)
- `domain/repositories` — interfaces (`IProductRepository`)
- `domain/usecases` — `GetProductsUseCase`, `SearchProductsUseCase` (thin, orchestrate repo calls)
- `data/datasources/supabase/product.datasource.ts` — actual Supabase queries; results are wrapped in `unstable_cache` (24h revalidate, matches a daily sync cron) — pure functions defined outside the class so they serialize correctly for the cache
- `data/repositories/product.repository.impl.ts` — implements the domain interface over the datasource
- `presentation/components` — React components; `presentation/store` — Zustand stores (`carrito.store.ts` cart, `ui.store.ts`)

Both the REST route `app/api/products/route.ts` and the GraphQL resolvers reuse this same domain/repository/use-case stack — don't fork a second implementation for one or the other.

Other feature modules (`home`, `landing`, `about`, `contact`, `apps`, `fix`, `upgrade`, `auth`, `store`, `(my-sit)`) are presentation-only (`presentation/components`, occasionally `presentation/store`) — content/marketing pages and the customer portal UI, no domain/data layers. `modules/(my-sit)` (parenthesized, not a route segment) holds the customer dashboard components consumed by `app/[locale]/my-sit/**`.

### Route structure

- `app/[locale]/**` — all user-facing pages (marketing, store, admin dashboard, my-sit portal), locale-prefixed via next-intl (`i18n/routing.ts`: locales `en`/`es`, default `es`).
- `app/api/**` — route handlers, not locale-prefixed. Grouped by domain: `clientes`, `cupones`, `deals` (quotes/cotizaciones), `grupos`, `products`, `graphql`, `my-sit/*` (customer-facing counterparts of the admin endpoints), `auth` (NextAuth), `revalidate`, `feedback`.
- Translations: `messages/en.json` / `messages/es.json`, loaded per-request in `i18n/request.ts`.

### Cross-cutting helpers (`core/helpers`)

- `auth.ts` / `auth/*` — the two auth systems described above.
- `cashback/calcular-cashback.ts` — cashback earning calculation, used when quotes convert to paid deals.
- `precio.utils.ts` — pricing/currency (Pesos/Dolares) formatting helpers shared across catalog and admin store UI.
- `email/` — Resend-based email; `send.ts` wraps the client, `templates/*.template.ts` are string-built HTML templates (bienvenida = client welcome w/ generated password, cambio-status, nuevo-mensaje). New transactional emails should follow the same template-function + `sendEmail` pattern.
- `pdf/cotizacion.pdf.ts` — jsPDF + autotable generation for quote/cotización PDFs.
- `rate-limit.ts` — in-memory (per-process, non-distributed) IP rate limiter; currently only guards `/api/feedback`.
- `require-auth.ts`, `auth/require-client-auth.ts` — the two API-route auth guards; always call at the top of a handler before touching data.

### Redirects and hosting

`next.config.ts` hardcodes host-based redirects for `sitmorelia.com.mx` / `www.sitmorelia.com.mx` → `/es`. Remote images are locked to `me2.grupocva.com` via `images.remotePatterns`. `serverComponentsExternalPackages` includes `@apollo/server` (needed for the GraphQL route to work under App Router).

## Environment variables

`MONGODB_URI`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_GRAPHQL_URL`, `NEXTAUTH_SECRET`, `CLIENT_JWT_SECRET`, `RESEND_API_KEY`, `RESEND_FROM`, `NEXT_PUBLIC_APP_URL`, `ADMIN_EMAIL`.

## Import alias

`@/*` maps to the repo root (see `tsconfig.json`), e.g. `@/core/helpers/auth`, `@/modules/admin/store/...`.
