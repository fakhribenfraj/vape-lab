# Research: Mixing Lab Inventory Feature

## Technology Decisions

### Decision: Next.js 16 App Router
**Rationale**: Next.js 16 provides the latest features including Server Components, improved performance, and full TypeScript support. App Router offers better data fetching patterns with Server Actions and streaming.

**Alternatives considered**:
- Remix: Good alternative but Next.js has larger ecosystem
- Plain React: Would require more boilerplate for routing/SSR

---

### Decision: shadcn/ui Component Library
**Rationale**: Mobile-first accessible components built on Radix UI primitives. Customizable via Tailwind CSS, follows consistent design patterns. Reduces development time while ensuring accessibility.

**Alternatives considered**:
- MUI: Too heavy, not mobile-first by default
- Chakra UI: Good but shadcn offers more control
- Headless UI: Requires more setup

---

### Decision: React Hook Form + Zod
**Rationale**: Industry standard combination for form validation. React Hook Form provides minimal re-renders and great performance. Zod offers runtime type validation that matches TypeScript types.

**Alternatives considered**:
- Formik: More verbose, higher re-renders
- React Hook Form alone: No schema validation
- Yup: Less type-safe than Zod

---

### Decision: TanStack Query (React Query)
**Rationale**: Best-in-class server state management with caching, optimistic updates, and background refetching. Essential for real-time inventory data.

**Alternatives considered**:
- SWR: Good but TanStack Query has more features
- Redux Toolkit Query: More complex setup
- Context API: Not suitable for server state

---

### Decision: Neon (Serverless PostgreSQL) + Prisma ORM
**Rationale**: Serverless PostgreSQL with excellent TypeScript support. Prisma ORM provides type-safe database access, migrations, and excellent developer experience. Neon scales automatically with pay-per-use pricing. Prisma works seamlessly with serverless environments.

**Alternatives considered**:
- @neondatabase/serverless: Good but no ORM layer - would need raw SQL
- Drizzle ORM: Lighter but less mature than Prisma
- Supabase: Good but Neon has better serverless experience
- PlanetScale: MySQL instead of PostgreSQL (less familiar)
- Traditional VPS: More operational overhead

---

### Decision: Better Auth
**Rationale**: Modern authentication library for Next.js with type-safe APIs. Built-in support for multiple providers, session management, and RBAC. Works well with React patterns.

**Alternatives considered**:
- NextAuth.js (Auth.js): Good but Better Auth has simpler API
- Clerk: Good but adds third-party dependency
- Supabase Auth: Tied to Supabase

---

## Best Practices

### Mobile-First Development
- Use Tailwind's mobile-first breakpoints
- Design touch-friendly targets (44px minimum)
- Test on actual mobile devices early

### Data Model Patterns
- Use UUIDs for all entity IDs
- Implement soft deletes for audit trail
- Version sensitive entities (recipes, compliance)

### Real-Time Sync
- Use TanStack Query with 30-second polling intervals for inventory sync
- WebSocket optional for future steeping notifications
- Optimistic updates for better UX

---

## EU TPD Compliance Considerations
- Maximum nicotine strength limits (20mg/ml)
- Child-resistant packaging requirements
- Ingredient reporting and labeling
- Batch traceability requirements
- Maximum tank size limits (2ml for closed systems)
