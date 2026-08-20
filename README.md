# Rayana De Silva — Heart Matters

A full-stack Next.js website and admin CMS for **Rayana De Silva — Heart Matters**: public marketing pages, session booking with timezone-aware availability, Stripe and e-transfer payments, contact and review submissions, and a protected admin dashboard for content management.

Built with **Next.js 16**, **React 19**, **MongoDB/Mongoose**, **NextAuth**, **Stripe**, **Tailwind CSS**, and **Sharp** for image processing.

---

## Prerequisites

| Requirement | Version |
|-------------|---------|
| **Node.js** | 20 or later |
| **npm** | 10+ (ships with Node 20) |
| **MongoDB** | 6+ (local install or MongoDB Atlas) |
| **MongoDB Compass** | Optional, recommended for browsing data |

---

## Installation

```bash
git clone <repository-url>
cd rayana
npm install
```

Copy the example environment file if you need additional keys (Stripe, SMTP):

```bash
cp .env.example .env.local
```

The project ships with development defaults in `.env.local`. Adjust values as needed before running locally or deploying.

---

## MongoDB setup

### Local MongoDB

1. Install and start MongoDB locally (default port `27017`).
2. Open **MongoDB Compass**.
3. Connect using:

```
mongodb://127.0.0.1:27017/rayana_heart_matters
```

This matches the default `MONGODB_URI` in `.env.local`. Compass will create the database on first write.

### MongoDB Atlas (optional)

Create a free cluster, add a database user, allow your IP, and set:

```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/rayana_heart_matters
```

---

## Environment configuration (`.env.local`)

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `AUTH_SECRET` | NextAuth signing secret (min 32 characters in production) |
| `ADMIN_EMAIL` | Admin login email (used by seed script) |
| `ADMIN_PASSWORD` | Admin login password (used by seed script) |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (e.g. `http://localhost:3000`) |
| `HOST_TIME_ZONE` | Booking host timezone (default `America/Vancouver`) |
| `DEFAULT_CURRENCY` | Default currency (default `CAD`) |
| `UPLOAD_DIR` | Local upload directory (default `public/uploads`) |
| `RECORDINGS_DIR` | Session recording storage (default `storage/recordings`) |
| `SMTP_*` | SMTP settings for outbound email (optional in dev) |
| `STRIPE_*` | Stripe keys and webhook secret (optional until payments enabled) |

**Development defaults** (already in `.env.local`):

```env
MONGODB_URI=mongodb://127.0.0.1:27017/rayana_heart_matters
AUTH_SECRET=dev-secret-change-in-production-min-32-chars-long
ADMIN_EMAIL=admin@heartmatters.com
ADMIN_PASSWORD=Admin123!ChangeMe
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **Security:** Never commit real secrets. Replace all defaults before production deployment.

---

## Seed the database

The seed script is **idempotent**—safe to run multiple times. It creates site settings, pages, services, pricing, testimonials, FAQs, gallery content, sample blog posts, availability rules, and the admin user.

```bash
npm run seed
```

Ensure MongoDB is running and `MONGODB_URI`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` are set first.

---

## Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site.

### Admin login

| | |
|---|---|
| **URL** | [http://localhost:3000/admin/login](http://localhost:3000/admin/login) |
| **Email** | Value of `ADMIN_EMAIL` (default `admin@heartmatters.com`) |
| **Password** | Value of `ADMIN_PASSWORD` (default `Admin123!ChangeMe`) |

Protected admin routes redirect unauthenticated users to the login page.

---

## Stripe webhook testing

1. Create a [Stripe](https://stripe.com) account and add keys to `.env.local`:

```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

2. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli).

3. Forward webhooks to your local server:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the webhook signing secret (`whsec_...`) into `STRIPE_WEBHOOK_SECRET`.

4. Trigger test events:

```bash
stripe trigger checkout.session.completed
```

The webhook handler verifies signatures, **deduplicates events by Stripe event ID** (stored in audit logs), and confirms bookings on successful payment.

Enable Stripe in **Admin → Settings → Payments** after keys are configured.

---

## SMTP configuration

Email is optional in development—messages are logged to the console when SMTP is not configured.

For production or local email testing, set:

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-user
SMTP_PASSWORD=your-password
SMTP_FROM=noreply@heartmatters.com
SMTP_FROM_NAME=Rayana De Silva — Heart Matters
```

Used for booking confirmations, contact notifications, and admin-triggered mail.

---

## Upload storage

| Setting | Default | Notes |
|---------|---------|-------|
| `UPLOAD_DIR` | `public/uploads` | Images saved under `public/uploads/<year>/<uuid>/` |
| Variants | thumb, md, full | Generated as WebP via Sharp |
| Allowed types | JPEG, PNG, WebP, GIF, AVIF | Validated server-side |
| Max size | 15 MB | Per upload |

**Local development:** Files are written to disk and served at `/uploads/...`.

**Deployment notes:**

- Ensure the upload directory is **writable** by the Node process.
- On ephemeral hosts (e.g. some PaaS containers), disk uploads are lost on redeploy—use persistent volumes or migrate to object storage (S3, R2, etc.) for production.
- Run backups of `public/uploads` and `storage/recordings` alongside MongoDB backups.

---

## Backup and restore

### MongoDB

**Backup:**

```bash
mongodump --uri="mongodb://127.0.0.1:27017/rayana_heart_matters" --out=./backup/rayana-$(date +%Y%m%d)
```

**Restore:**

```bash
mongorestore --uri="mongodb://127.0.0.1:27017/rayana_heart_matters" --drop ./backup/rayana-YYYYMMDD/rayana_heart_matters
```

### Uploads and recordings

Copy these directories to your backup location:

- `public/uploads/`
- `storage/recordings/`

Restore by copying them back after a fresh deploy or database restore.

---

## Testing and quality checks

### Unit tests (Vitest)

```bash
npm test
```

Covers booking timezone/DST conversion, reschedule tokens, Stripe webhook idempotency, upload MIME validation, and rate limiting.

### End-to-end tests (Playwright)

Requires MongoDB running and a seeded database for admin auth tests:

```bash
npm run seed
npm run test:e2e
```

Playwright starts the dev server automatically (`baseURL`: `http://localhost:3000`).

Install browsers once:

```bash
npx playwright install chromium
```

### Other commands

| Command | Purpose |
|---------|---------|
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript (`tsc --noEmit`) |
| `npm run build` | Production build |

---

## Project structure (high level)

```
app/              Next.js App Router (public site + admin + API routes)
components/       UI, forms, sections, admin components
lib/              Auth, booking, email, payments, storage, validation
models/           Mongoose schemas
scripts/          Database seed
tests/            Vitest unit tests + Playwright e2e specs
public/           Static assets and local uploads
```

---

## Production checklist

- [ ] Replace all secrets in environment variables
- [ ] Set `NEXT_PUBLIC_SITE_URL` to your production domain
- [ ] Configure SMTP for transactional email
- [ ] Configure Stripe keys and webhook endpoint in the Stripe Dashboard
- [ ] Use persistent storage for uploads (or object storage)
- [ ] Schedule MongoDB and file backups
- [ ] Run `npm run build` and `npm test` before deploy

---

## License

Private project for Rayana De Silva — Heart Matters.
