# Implementation Plan: 001-mixing-lab-inventory

**Branch**: `001-mixing-lab-inventory` | **Date**: 2026-03-10 | **Spec**: specs/001-mixing-lab-inventory/spec.md
**Input**: Feature specification from specs/001-mixing-lab-inventory/spec.md

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

VapeLab.io is a specialized ERP and POS platform for vape retailers and e-liquid manufacturers. The initial feature (001-mixing-lab-inventory) focuses on the Mixing Lab Module for precise weight-based recipe management and Smart Inventory System for tracking raw materials (PG, VG, nicotine, concentrates) with milliliter precision. Built as a mobile-first Next.js 16 web application with Neon database, Prisma ORM, and better-auth for authentication.

## Technical Context

**Language/Version**: TypeScript (Next.js 16 App Router)  
**Primary Dependencies**: shadcn/ui, react-hook-form, zod, @tanstack/react-query, prisma, @prisma/client, better-auth  
**Storage**: Neon (PostgreSQL serverless) with Prisma ORM  
**Testing**: Vitest (unit), Playwright (e2e)  
**Target Platform**: Web (responsive, mobile-first)  
**Project Type**: Full-stack web application  
**Performance Goals**: <100ms API responses, optimized for mobile networks  
**Real-Time Sync**: TanStack Query with 30-second polling intervals for inventory sync. WebSocket optional for future steeping notifications.  
**Constraints**: EU TPD compliance, mobile-first responsive design  
**Scale/Scope**: Small single-store (up to 100 recipes, 500 monthly transactions)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Gate Evaluation

| Gate | Status | Notes |
|------|--------|-------|
| **I. Code Quality** | PASS | Using established libraries (shadcn, zod, tanstack query) with built-in validation patterns |
| **II. Simplicity** | PASS | Single Next.js application, using serverless Neon for simple database setup, no premature abstraction |
| **III. UX Consistency** | PASS | Mobile-first with shadcn/ui component library ensuring consistent patterns |
| **IV. Scalability** | PASS | Serverless architecture (Neon + Next.js) allows horizontal scaling; data model supports growth |
| **Technology Standards** | PASS | Next.js 16 (latest), all dependencies are stable and well-maintained |
| **Testing** | PASS | Will use Vitest for unit tests and Playwright for e2e as per existing conventions |

No violations detected. Feature uses well-established stack with proven patterns.

## Project Structure

### Documentation (this feature)

```text
specs/001-mixing-lab-inventory/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
app/ 16 App Router                    # Next.js
├── (auth)/            # Authentication routes
├── (dashboard)/       # Protected dashboard routes
│   ├── recipes/       # Recipe management
│   ├── batches/       # Batch production
│   ├── inventory/     # Inventory management
│   ├── compliance/    # Compliance tracking
│   └── customers/     # Customer/loyalty
├── api/               # API routes
lib/                   # Shared utilities
├── db/                 # Prisma client & queries
│   ├── client.ts       # Prisma client singleton
│   └── index.ts       # Database utilities
├── auth/              # Better-auth configuration
└── validation/        # Zod schemas
components/
├── ui/                # shadcn/ui components
├── recipes/           # Recipe-specific components
├── batches/           # Batch-specific components
└── inventory/         # Inventory-specific components
hooks/                 # Custom React hooks
types/                 # TypeScript types

tests/
├── unit/              # Vitest unit tests
├── integration/       # Integration tests
└── e2e/               # Playwright e2e tests
```

**Structure Decision**: Next.js 16 App Router with shadcn/ui. Server-side data fetching with TanStack Query for client state. Neon serverless PostgreSQL with Prisma ORM for storage. Better-auth for authentication.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
