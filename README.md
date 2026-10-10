# FleetGo

Fleet management mobile app + Next.js backend starter.

## Stack

- Mobile: Expo + React Native + TypeScript
- Backend: Next.js App Router + Prisma + PostgreSQL
- Auth: JWT with role-based access control

## Monorepo structure

```bash
fleetgo/
├── apps/
│   ├── api/
│   └── mobile/
├── package.json
├── README.md
└── .gitignore
```

## Start

```bash
npm install
npm run dev:api
npm run dev:mobile
```

## API

```bash
cd apps/api
cp .env.example .env
npx prisma migrate dev --name init
npm run dev
```

## Mobile

```bash
cd apps/mobile
cp .env.example .env
npm install
npx expo start
```
