# MANTIS — Mentorship Marketplace

> **Stop guessing, start talking.**

MANTIS is a mentorship marketplace built for serious learners and seasoned professionals. Connect instantly with vetted industry veterans and PhD researchers for 1-on-1 live mentorship sessions.

---

## Architecture

```
mantis/
├── apps/
│   ├── api/          # NestJS 11 + Express 5 + Prisma 7 + PostgreSQL
│   ├── web/          # Next.js 15 + React 19 + next-intl + Stripe
│   └── recommender/  # FastAPI + scikit-learn (Python 3.12)
├── docker-compose.yml
├── turbo.json
└── package.json
```

## Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 15, React 19, next-intl, Serwist PWA |
| **Backend** | NestJS 11, Express 5, Prisma 7, PostgreSQL 15 |
| **Payments** | Stripe (escrow via manual capture) |
| **Real-time** | Socket.io + Redis adapter |
| **AI** | OpenAI, LangChain (stub), FastAPI recommender |
| **Auth** | JWT + Google OAuth + 2FA (TOTP) |
| **Storage** | AWS S3 |
| **Infra** | Docker Compose, Turborepo |
| **Observability** | OpenTelemetry + Prometheus |

## Quick Start

### Development (Docker)

```bash
# Copy env template
cp .env.example .env
# Fill in your secrets in .env

# Start all services
docker-compose up -d

# API:  http://localhost:3001
# Web:  http://localhost:3000
# Docs: http://localhost:3001/api/docs
```

### Local Development

```bash
npm install
npm run dev
```

## Environment Variables

Copy `.env.example` → `.env` and fill in:

- `DATABASE_URL` — PostgreSQL connection string
- `REDIS_URL` — Redis connection string  
- `JWT_SECRET` — Min 32 chars random string
- `STRIPE_SECRET_KEY` — From Stripe dashboard
- `GOOGLE_CLIENT_ID/SECRET` — From Google Cloud Console

## API Documentation

Swagger UI available at `http://localhost:3001/api/docs` when running locally.

## Deployment

- **API** → [Render](https://render.com) (auto-deploys from `apps/api/`)
- **Web** → [Vercel](https://vercel.com) (auto-deploys from `apps/web/`)
- **DB** → Supabase or Render PostgreSQL
- **Redis** → Upstash or Render Redis
- **ML** → Render (Python service)

## Key Features

- ✅ **Learner/Expert roles** with onboarding
- ✅ **Expert search** with skill + rating filters + AI matching
- ✅ **Session booking** with calendar/time slot selection
- ✅ **Stripe escrow** — payment held until session ends
- ✅ **Live video sessions** (WebRTC — next release)
- ✅ **Real-time messaging** via Socket.io
- ✅ **Star ratings & reviews** with auto recalculation
- ✅ **2FA (TOTP)** with QR code
- ✅ **Google OAuth**
- ✅ **i18n** (English + Spanish)
- ✅ **PWA** support
- ✅ **Admin dashboard**
- ✅ **Feature flags** with canary rollout
- ✅ **OpenTelemetry** metrics

---

*Built with ❤️ — Stop guessing, start talking.*
