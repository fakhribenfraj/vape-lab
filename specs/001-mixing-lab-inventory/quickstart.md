# Quickstart: Mixing Lab Inventory

## Prerequisites

- Node.js 20+
- pnpm (recommended) or npm
- Neon account (https://neon.tech)
- Git

## Setup

1. **Clone and install dependencies**
   ```bash
   cd vaporLab
   pnpm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Required env variables:
   ```env
   # Database (Neon)
   DATABASE_URL="postgresql://user:pass@host/neon?schema=public"
   
   # Auth (Better Auth)
   BETTER_AUTH_SECRET="your-secret-key"
   BETTER_AUTH_URL="http://localhost:3000"
   
   # App
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

3. **Set up database**
   ```bash
   pnpm prisma generate   # Generate Prisma client
   pnpm prisma db push   # Push schema to Neon
   pnpm db:seed          # Seed initial data (optional)
   ```

4. **Run development server**
   ```bash
   pnpm dev
   ```

5. **Open browser**
   - App: http://localhost:3000
   - Login: Use seeded test account

## Project Structure

```
app/                    # Next.js 16 App Router
├── (auth)/            # Auth routes (login, register)
├── (dashboard)/       # Protected routes
│   ├── recipes/       # Recipe CRUD
│   ├── batches/       # Batch management
│   ├── inventory/     # Inventory management
│   └── page.tsx       # Dashboard home

lib/
├── db/                 # Prisma client & queries
├── auth/               # Better Auth config
└── validation/         # Zod schemas

components/
├── ui/                # shadcn components
├── recipes/           # Recipe components
├── batches/           # Batch components
└── inventory/         # Inventory components
```

## Key Concepts

### Recipes
- Recipes are versioned (increment on update)
- Target weights stored per ingredient
- Steeping duration tracked in hours

### Batches
- Created from recipes (locks recipe version)
- Status flow: pending → mixing → steeping → ready → completed
- Actual weights recorded during mixing
- Inventory auto-deducted on completion

### Inventory
- Raw materials linked to ingredients
- Low stock alerts based on reorder threshold
- Full transaction history maintained

## Common Tasks

### Create a Recipe
```typescript
// Use the recipe form component
// POST /api/recipes
{
  name: "Fruit Blast",
  steepingDurationHours: 72,
  targetNicotineMg: 3.0,
  targetPgRatio: 50.0,
  targetVgRatio: 50.0,
  ingredients: [
    { ingredientId: "...", targetAmount: 50, orderIndex: 0 }
  ]
}
```

### Start a Batch
```typescript
// Use the batch creation flow
// POST /api/batches
{
  recipeId: "uuid"
}
// Then POST /api/batches/:id/start with actual weights
```

### Record Inventory Receipt
```typescript
// POST /api/inventory/:id/receive
{
  quantity: 500,
  lotNumber: "LOT-123",
  supplier: "ChemSupply"
}
```

## Testing

```bash
pnpm test           # Run unit tests
pnpm test:e2e       # Run Playwright e2e tests
```

## Tech Stack References

- [Next.js 16](https://nextjs.org/docs) - App Router, Server Actions
- [shadcn/ui](https://ui.shadcn.com) - Components
- [TanStack Query](https://tanstack.com/query) - Server state
- [Zod](https://zod.dev) - Validation
- [Prisma](https://prisma.io/docs) - ORM
- [Neon](https://neon.tech/docs) - Serverless PostgreSQL
- [Better Auth](https://www.better-auth.com) - Authentication
