# Data Model: Mixing Lab Inventory

> Implemented with Prisma ORM + Neon PostgreSQL

## Prisma Schema Overview

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## Entities

### User
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| email | string | unique, not null | User email |
| name | string | not null | Display name |
| password_hash | string | not null | Hashed password |
| role | enum | not null | 'owner', 'technician', 'manager' |
| store_id | UUID | FK → Store | Associated store |
| created_at | timestamp | not null | Creation timestamp |
| updated_at | timestamp | not null | Last update timestamp |

### Store
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| name | string | not null | Store name |
| owner_id | UUID | FK → User | Store owner |
| timezone | string | not null | Store timezone |
| created_at | timestamp | not null | Creation timestamp |

---

### Recipe
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| store_id | UUID | FK → Store | Owner store |
| name | string | not null | Recipe name |
| version | integer | not null, default 1 | Version number |
| description | text | nullable | Recipe description |
| steeping_duration_hours | integer | not null | Required steeping time |
| target_nicotine_mg | decimal | not null | Target nicotine strength |
| target_pg_ratio | decimal | not null | Target PG percentage |
| target_vg_ratio | decimal | not null | Target VG percentage |
| status | enum | not null | 'draft', 'active', 'archived' |
| created_by | UUID | FK → User | Created by user |
| created_at | timestamp | not null | Creation timestamp |
| updated_at | timestamp | not null | Last update timestamp |

**Validation Rules**:
- PG + VG ratios must sum to 100
- Nicotine strength max 20mg/ml (EU TPD)
- Version increments on each update

---

### Ingredient
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| name | string | not null | Ingredient name |
| type | enum | not null | 'pg', 'vg', 'nicotine', 'flavor', 'additive' |
| unit | string | not null | Measurement unit ('ml', 'g') |
| description | text | nullable | Description |

---

### RecipeIngredient
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| recipe_id | UUID | FK → Recipe | Parent recipe |
| ingredient_id | UUID | FK → Ingredient | Ingredient used |
| target_amount | decimal | not null | Target amount (ml/g) |
| order_index | integer | not null | Display order |

**Validation Rules**:
- Target amounts must be positive

---

### RawMaterial (Inventory Item)
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| store_id | UUID | FK → Store | Owner store |
| ingredient_id | UUID | FK → Ingredient | Associated ingredient |
| lot_number | string | nullable | Supplier lot number |
| current_stock | decimal | not null, default 0 | Current quantity |
| unit | string | not null | Measurement unit |
| reorder_threshold | decimal | not null | Low stock alert level |
| cost_per_unit | decimal | nullable | Unit cost |
| supplier | string | nullable | Supplier name |
| expiry_date | date | nullable | Expiration date |
| created_at | timestamp | not null | Creation timestamp |
| updated_at | timestamp | not null | Last update timestamp |

**Validation Rules**:
- Current stock >= 0
- Reorder threshold >= 0

---

### Batch
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| store_id | UUID | FK → Store | Owner store |
| recipe_id | UUID | FK → Recipe | Source recipe |
| recipe_version | integer | not null | Recipe version at creation |
| batch_number | string | not null, unique | Human-readable batch ID |
| status | enum | not null | 'pending', 'mixing', 'steeping', 'ready', 'completed', 'cancelled' |
| started_at | timestamp | nullable | Mixing start time |
| completed_at | timestamp | nullable | Mixing completion time |
| steeping_started_at | timestamp | nullable | Steeping start time |
| steeping_completed_at | timestamp | nullable | Steeping completion target |
| notes | text | nullable | Production notes |
| created_by | UUID | FK → User | Created by user |
| created_at | timestamp | not null | Creation timestamp |
| updated_at | timestamp | not null | Last update timestamp |

**State Transitions**:
```
pending → mixing → steeping → ready → completed
              ↓                   
            cancelled
```

---

### BatchIngredient (Actual usage)
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| batch_id | UUID | FK → Batch | Parent batch |
| ingredient_id | UUID | FK → Ingredient | Ingredient used |
| raw_material_id | UUID | FK → RawMaterial | Source material |
| actual_amount | decimal | not null | Actual amount used |
| target_amount | decimal | not null | Target from recipe |
| variance | decimal | computed | actual - target |

---

### Customer
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| store_id | UUID | FK → Store | Owner store |
| email | string | nullable | Email address |
| phone | string | nullable | Phone number |
| name | string | not null | Customer name |
| loyalty_points | integer | not null, default 0 | Current points balance |
| created_at | timestamp | not null | Creation timestamp |
| updated_at | timestamp | not null | Last update timestamp |

---

### LoyaltyTransaction
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| customer_id | UUID | FK → Customer | Customer |
| type | enum | not null | 'earn', 'redeem' |
| points | integer | not null | Points change (+/-) |
| description | string | not null | Transaction description |
| created_at | timestamp | not null | Creation timestamp |

---

### ComplianceRecord
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| batch_id | UUID | FK → Batch | Associated batch |
| document_type | enum | not null | 'tpd_report', 'traceability', 'quality' |
| content | jsonb | not null | Generated document content |
| generated_at | timestamp | not null | Generation timestamp |

---

### InventoryTransaction
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| raw_material_id | UUID | FK → RawMaterial | Material affected |
| type | enum | not null | 'receive', 'use', 'adjust', 'expire' |
| quantity | decimal | not null | Quantity change |
| batch_id | UUID | FK → Batch | Associated batch (if any) |
| notes | text | nullable | Transaction notes |
| created_by | UUID | FK → User | Created by user |
| created_at | timestamp | not null | Creation timestamp |

---

## Relationships

```
Store
├── Users (1:N)
├── Recipes (1:N)
│   └── RecipeIngredients (1:N)
│       └── Ingredients (N:1)
├── Batches (1:N)
│   └── BatchIngredients (1:N)
│       └── RawMaterials (N:1)
│           └── InventoryTransactions (1:N)
├── RawMaterials (1:N)
├── Customers (1:N)
│   └── LoyaltyTransactions (1:N)
└── ComplianceRecords (1:N)
```

---

## Indexes

- `recipes(store_id, name)` - Recipe lookup
- `batches(store_id, batch_number)` - Batch lookup
- `batches(status, steeping_completed_at)` - Steeping notifications
- `raw_materials(store_id, ingredient_id)` - Inventory lookup
- `inventory_transactions(raw_material_id, created_at)` - Stock history
- `compliance_records(batch_id, document_type)` - Compliance lookups

---

## Soft Deletes

All primary entities (except transactions) use soft deletes:
- `deleted_at: timestamp | null`
- Queries filter by `deleted_at IS NULL` by default
