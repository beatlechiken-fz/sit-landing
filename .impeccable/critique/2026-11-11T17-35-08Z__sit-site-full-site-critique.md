---
target: SIT site — full site critique
total_score: 19
max_score: 28
na_heuristics: 7,9,10
p0_count: 2
p1_count: 2
timestamp: 2026-11-11T17-35-08Z
slug: sit-site-full-site-critique
---
Method: dual-agent (A: ae2da944cdefc5e68 · B: a2cfba4171c2a9496)

#### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2/4 | Scroll/entry fade-ins leave whole sections blank/black for 1–3s with no loading indicator (confirmed independently by both assessments on /ia, /about, /contact, /promotions). |
| 2 | Match System / Real World | 2/4 | WhatsApp-first contact fits Mexican SME norms, but repair vocabulary ("Pro Gamer", "¿Ya falló?") doesn't match the new B2B buyer at all. |
| 3 | User Control and Freedom | 3/4 | Good eyebrow wayfinding, easy locale switch, no modal traps. |
| 4 | Consistency and Standards | 3/4 | Strong visual consistency, undercut by nav parents that are both links and hover-dropdown triggers. |
| 5 | Error Prevention | 3/4 | Reassurance copy ("sin letras chiquitas", "sin compromiso") pre-empts anxiety at cotización moments. |
| 6 | Recognition Rather Than Recall | 3/4 | Pricing/process stays visible in context. |
| 7 | Flexibility and Efficiency | n/a | Persuade-mode marketing site, no power-user paths to score. |
| 8 | Aesthetic and Minimalist Design | 3/4 | Clean and consistent, but generic rather than distinctive; body copy often low-contrast gray-on-near-black. |
| 9 | Error Recovery | n/a | No error-prone transactional flow in scope (lead-gen only, routes to WhatsApp). |
| 10 | Help and Documentation | n/a | Not applicable to a marketing site. |
| **Total** | | **19/28** | **Acceptable (≈68%) — real credibility gaps, not a catastrophe** |

#### Design Specificity Verdict

**LLM assessment**: The site reads as a generic dark-mode "AI/SaaS startup" template — near-black background, teal→blue gradient accents, isometric illustrations, 3-card grids, a numbered "Cómo trabajamos" strip — reskinned with Spanish copy. Nothing visually signals "10 years of hands-on repair work in Morelia" or "we touch real hardware," which is a real miss for a business whose other pivot leg is literally physical equipment repair. Swap the copy and this could be any dev shop or AI consultancy anywhere.

**Deterministic scan**: `detect.mjs` found 58 findings across `app/modules/core`: 50× `gradient-text` (the `bg-clip-text` + `bg-gradient` heading treatment, one hit each in ~30 distinct presentation components spanning about/apps/fix/home/ia/landing/maintenance/promotions), 4× `overused-font` and 2× `side-tab` (both confined to the Resend email templates, not the public pages), 1× `gray-on-color` (customer-portal `CambiarPasswordForm.tsx`, behind auth), 1× `ai-color-palette` (admin `ClienteDetail.tsx`). The 50 gradient-text hits corroborate the LLM verdict almost exactly: the *same* heading treatment repeated in 30+ otherwise-unrelated files is precisely the "category-interchangeable, one template stretched over every vertical" pattern flagged above.

**False positives / out-of-scope flags**: the `ai-color-palette` hit on /ia's brain illustration is a deliberate, consistent brand choice sitewide, not obviously a defect. The `gray-on-color` and `side-tab`/`overused-font` findings live in the customer portal and transactional emails respectively — outside the 12 public marketing pages this critique is about — worth a cleanup pass later but not part of the "does the public site look credible" verdict.

**Visual overlays**: no browser-visible overlay was produced — live injection requires standing up `live-server.mjs` as its own process, which was out of scope for this pass, so no `[Human]`-tab overlay is available this run.

#### Overall Impression

The site is competently built and internally consistent — nothing is broken, the process pattern repeats cleanly, pricing is transparent. But it is a generic dark AI-SaaS template that doesn't yet reflect the two bets just decided: AI automation (the intended flagship) is buried inside an "Aplicaciones" dropdown with no pricing or case studies, and repair/maintenance/upgrade still speaks in pure consumer voice ("Mantenimiento Pro Gamer") right where the plan is to sell B2B equipment-support contracts. The single biggest opportunity: make the site's *structure* match the new strategy, not just its words.

#### What's Working

- **`/landing/a-la-medida` pricing**: the most trust-building page on the site — transparent tiers, a dedicated "¿Por qué puede ajustarse la cuota?" objection-handler, plain payment terms (50/50, monthly billing start).
- **Recurring "Cómo trabajamos" numbered-process block**: repeats near-identically across service pages, a genuine reusable asset that reduces ambiguity about what happens after first contact.
- **Context-aware WhatsApp CTA prefill**: the home "Hablar con un experto" button pre-fills a message about app+AI development specifically, not a generic greeting — real craftsmanship.
- **`/parts` is honest about the pivot**: explicitly states "No es tienda en línea," correctly reflecting today's cart removal instead of leaving a dangling buy affordance.

#### Priority Issues

**[P0] AI automation — the stated flagship — is structurally buried.**
Why it matters: site emphasis is the clearest signal of priority a buyer reads; today the site tells visitors SIT is a repair shop with an apps side-business, not an AI consultancy.
Fix: give IA its own top-level nav entry, a homepage section/hero slot, and at least rough pricing/engagement tiers like every other vertical already has.
Suggested command: `/impeccable shape` (ia section), then `/impeccable layout`

**[P0] Repair/maintenance/upgrade copy contradicts the B2B repositioning.**
Why it matters: "Mantenimiento Pro Gamer," "Mantenimiento Apple Care+," "¿Tu equipo falló?," single-device MXN pricing, and a dated back-to-school promo give an IT/facilities manager nothing to self-identify with.
Fix: add a distinct enterprise/fleet-support tier (multi-device pricing, SLA/response-time language, account contact) alongside — not replacing — the consumer SKUs; keep the student promo out of the pages enterprise visitors are funneled to.
Suggested command: `/impeccable clarify` (fix/maintenance copy), `/impeccable shape` (new B2B tier)

**[P1] No social proof anywhere across all 12 pages.**
Why it matters: no client logos, testimonials, named case studies, or team/office photos; "+100 equipos atendidos" is the only proof point and reads small-scale — credibility signals are the highest-leverage lever for winning enterprise trust, and the pivot currently has none.
Fix: 2-3 outcome-quantified case studies on /ia and /apps, plus a modest logos strip.
Suggested command: `/impeccable shape`

**[P1] Fade-in animations hide content for 1–3 seconds, site-wide.**
Why it matters: both assessments independently hit this — Assessment A reproduced fully blank sections on /ia, /about, /contact, /promotions with no loading indicator; Assessment B's own screenshots captured near-invisible dark-on-dark text immediately after navigation that only resolved after several seconds. A skeptical first-time enterprise visitor on a slower connection reads this as a broken, unmaintained site exactly while evaluating credibility.
Fix: default content to visible; treat animation as enhancement only, capped under 300ms, or trigger earlier in viewport.
Suggested command: `/impeccable optimize` or `/impeccable animate`

**[P2] Contact page has no business email, phone, or address.**
Why it matters: only WhatsApp + social DMs (including TikTok) are offered as "canales directos," and procurement-minded buyers expect a verifiable business contact before committing budget; the page's one linked form ("Ir al formulario") is actually a satisfaction survey, not a lead/quote form.
Fix: add a direct business email/phone and a real lead form; relabel or separate the feedback survey.
Suggested command: `/impeccable clarify`

**[P3] Nav parent items are simultaneously links and hover-dropdown triggers**, which is inconsistent and unusable by touch (can't hover). Make them pure toggles or pure links, not both.

**[P3] /fix's four service-card photos (computadoras/celulares/impresoras/actualizaciones) 400 on every load** — not user-visible breakage since the component already falls back to an icon gracefully, but the photography is simply missing; worth uploading once available.

#### Persona Red Flags

**Jordan (Confused First-Timer)**: Lands on /ia but the nav highlights "Aplicaciones" as active, not "IA" — disorienting. Unlike every other vertical, /ia shows zero pricing or packages, maximum ambiguity at the page meant to convert the highest-value leads.

**Riley (Deliberate Stress Tester)**: Reliably retriggers the blank-section fade-in bug on repeat visits/fast scrolls. Finds /promotions hardcoded to a campaign dated "Del 3 al 17 de agosto de 2026" — a year out, clearly stale placeholder content live in production.

**Casey (Distracted Mobile User)**: On mobile home, the first viewport is largely empty space until the fade-in resolves — on a slow connection this reads as a broken page before anything useful loads. CTAs are well thumb-placed once rendered, but the pre-render delay is exactly the friction a low-patience user won't tolerate.

**PYME manager evaluating IA automation or a support contract** (project-specific persona): Has to dig through "Aplicaciones" to find AI automation, then gets only generic capability cards with zero named clients or quantified results — and a "stack tecnológico" list that places "Lovable" (a no-code builder) next to OpenAI/Anthropic/LangChain, which can read as "no-code reseller" rather than "serious engineering shop" to a technical evaluator. For the support-contract need, /fix and /maintenance offer only single-device consumer pricing with gamer/Apple-fan package names — nothing says "we support fleets of computers across our offices under contract." The contact page gives no business email/phone/address to vet the vendor against. This persona might still text out of curiosity, but would hesitate to recommend SIT internally based on the site alone.

#### Minor Observations

- "Lovable" (no-code) listed alongside OpenAI/Anthropic/LangChain/Pinecone/Postgres on /ia's stack — odd signal to a technical buyer.
- Footer is minimal: city + social icons + copyright only, no privacy/legal links — matters more once pursuing enterprise procurement trust.
- Eyebrow/breadcrumb label above each hero is a nice, consistently-applied wayfinding touch.
- "Ir al formulario" on /contact is a mislabeled affordance — leads to a satisfaction/rating survey, not a quote request.
- Pricing currency/format (MXN) is consistent across all service pages.

#### Questions to Consider

- If AI automation is truly meant to be the new highest-margin flagship, why does it have no pricing, no case study, and live inside a dropdown literally called "Aplicaciones"?
- Would an IT/facilities manager evaluating a multi-device company support contract ever self-identify with a product named "Mantenimiento Pro Gamer"?
- Is the back-to-school consumer parts promotion (dated into August 2026) still meant to go live, and does it belong on the same site now selling enterprise AI contracts to the same visitors?
