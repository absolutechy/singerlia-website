# CLAUDE.md — singerlia-website

See root `../CLAUDE.md` for behavioral guidelines. This file adds website-specific context.

---

## Stack & Runtime

- **Framework:** React 19 + TypeScript 5
- **Build tool:** Vite 7 (SWC — faster than Babel, but incompatible with React Compiler)
- **Package manager:** npm
- **Dev port:** 5174
- **E2E testing:** Playwright (`npm run autofill:booking`)

## Who Uses This App

Public-facing booking site for customers and singers. No admin functionality.

- **Anonymous users:** browse singers, search, view profiles.
- **Logged-in customers:** book singers, track bookings, submit reviews.
- **Singers:** register, manage their own profile, upload documents, set unavailability.

There are **no role-based route guards** here — only auth-gated routes (must be logged in).

## Design System — Shadcn/UI + Tailwind

- UI primitives from **Shadcn/ui** (Radix UI base) in `src/components/ui/`.
- Custom theme: primary `#371552` (purple), secondary `#ffd700` (gold).
- Fonts: "TT Chocolates" for headings, "Outfit" for body — both loaded via CSS.
- **Always use the `cn()` utility** (`src/lib/utils.ts`) for conditional class merging. Never concatenate Tailwind classes with string interpolation.
- For new UI primitives, add them to `src/components/ui/`. For page-specific sections, add to `src/components/pageComponents/<PageName>/`.

## Forms — React Hook Form + Zod

All forms must use **React Hook Form** v7 + **Zod** v4 for validation. No `useState` for form fields.

```ts
const schema = z.object({ ... })
const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })
```

The booking form (`BookingSinger.tsx`) is the most complex example — refer to it for nested schema patterns.

## API Layer

- Axios instance in `src/api/axiosInstance.ts`. Timeout: **30 seconds** (payment flows are slow — do not reduce).
- Auto-injects Bearer token from localStorage.
- On 401: **only redirects to login on protected routes**. Public routes (below) silently clear the token instead.

**Public routes (no 401 redirect):**
`/search`, `/singers/*`, `/contact`, `/auth/*`, `/privacy-policy`, `/terms-and-conditions`

- Services in `src/api/services/` — one file per domain.

## Auth Pattern

- `authToken` (JWT) + `user` JSON (`{userId, name, email, role}`) stored in `localStorage`.
- Custom event system for cross-component sync:
  ```ts
  dispatchAuthEvent('logout')          // logout signal
  subscribeToAuthChanges(callback)     // listener
  ```
- Do not read `localStorage` directly in components — go through `authService`.

## Payment — HyperPay

- HyperPay renders as an **iframe widget** embedded in the page.
- **CSP nonce is required** for PCI DSS 4.x compliance. Use `src/lib/hyperPayUtils.ts` to generate nonces — never skip this.
- Payment flow: create booking → `paymentService.prepareCheckout()` → widget renders → `paymentService.getPaymentStatus()` (poll) → `paymentService.capturePayment()`.
- Test endpoint: `https://eu-test.oppwa.com`. Production: `https://eu-prod.oppwa.com` (set via env var).
- Do not alter the iframe injection logic without checking PCI DSS compliance.

## Singer Availability

- Singers block dates + time slots (morning/afternoon/evening) via `unavailabilityService`.
- The date picker in `BookingSinger.tsx` disables fully-booked dates client-side.
- Availability helpers: `isSlotAvailable()`, `isDateFullyBooked()` — use these, don't inline the logic.

## Vite Build Config — Intentional Settings

The `vite.config.ts` has deliberate optimizations. Don't simplify them:

- **SWC** (not Babel) — faster builds.
- **Manual chunk splitting:** react, router, ui, utils are separate bundles for better caching.
- **Image optimization:** PNG 85%, JPEG 75%, WebP 80% — always run through the optimizer, don't commit unoptimized images.
- **Asset paths:** CSS → `assets/css/`, images → `assets/images/`.

## Page Structure

Home page is composed from section components under `src/components/pageComponents/Home/`. Add new homepage sections there, not inline in `Home.tsx`.

For new pages: add the route to `src/router/AppRouter.tsx` and create the page under `src/pages/`.

## Environment

- `.env.development`: `VITE_API_BASE_URL=http://localhost:9000/api/`, HyperPay test URL.
- `.env.production`: `VITE_API_BASE_URL=https://api.singerlia.com/api/`, HyperPay prod URL.
- Do not hardcode API URLs or payment endpoints in component code.

## E2E Testing

- Playwright test script: `scripts/autofill-booking-hyperpay.mjs`
- Command: `npm run autofill:booking`
- Tests the full flow: login → booking form → HyperPay widget → payment submission.
- Run this after any changes to the booking or payment flow.
