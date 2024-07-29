# Nodexp API

A simple API that implements the Controller Pattern. And using decorators for Swagger instead of Comments.

## Usage

**Install the dependencies:**

```bash
npm i
```

OR

```bash
pnpm i
```

**Setup DB:**

We use PostgreSQL for this project. Create a DB, and add its URL in `.env`. Then migrate the Prisma Schema:

```bash
pnpm prisma migrate deploy
```

OR

```bash
npx prisma migrate deploy
```

Seed the DB

```bash
npm run seed
```

## Controllers

The controllers are auto-detected. They should be inside `controllers` directory and match `*.controller.ts` (The detecting is recursive).
