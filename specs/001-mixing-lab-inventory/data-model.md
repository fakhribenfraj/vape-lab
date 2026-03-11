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

### InventoryTransaction (Existing)

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

### Supplier

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| store_id | UUID | FK → Store | Owner store |
| name | string | not null | Supplier name |
| contact_name | string | nullable | Contact person |
| email | string | nullable | Email address |
| phone | string | nullable | Phone number |
| address | text | nullable | Full address |
| lead_time_days | integer | nullable | Typical delivery time |
| notes | text | nullable | Additional notes |
| created_at | timestamp | not null | Creation timestamp |
| updated_at | timestamp | not null | Last update timestamp |

---

### PurchaseOrder

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| store_id | UUID | FK → Store | Owner store |
| supplier_id | UUID | FK → Supplier | Supplier |
| order_number | string | not null, unique | Human-readable order ID |
| status | enum | not null | 'draft', 'ordered', 'partial', 'received', 'cancelled' |
| expected_date | date | nullable | Expected delivery date |
| received_date | date | nullable | Actual receipt date |
| total_cost | decimal | not null | Total order cost |
| notes | text | nullable | Order notes |
| created_by | UUID | FK → User | Created by user |
| created_at | timestamp | not null | Creation timestamp |
| updated_at | timestamp | not null | Last update timestamp |

---

### PurchaseOrderItem

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| purchase_order_id | UUID | FK → PurchaseOrder | Parent order |
| raw_material_id | UUID | FK → RawMaterial | Material ordered |
| quantity | decimal | not null | Quantity ordered |
| unit_cost | decimal | not null | Cost per unit |
| quantity_received | decimal | not null, default 0 | Quantity received |
| created_at | timestamp | not null | Creation timestamp |

---

### Product (Finished Goods)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| store_id | UUID | FK → Store | Owner store |
| batch_id | UUID | FK → Batch | Source batch |
| name | string | not null | Product name |
| sku | string | nullable | Stock keeping unit |
| volume_ml | decimal | not null | Volume per bottle |
| unit_price | decimal | not null | Selling price |
| cost | decimal | not null | Cost to produce |
| current_stock | integer | not null, default 0 | Available quantity |
| reorder_threshold | integer | not null | Low stock alert level |
| status | enum | not null | 'active', 'discontinued' |
| created_at | timestamp | not null | Creation timestamp |
| updated_at | timestamp | not null | Last update timestamp |

---

### Sale

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| store_id | UUID | FK → Store | Owner store |
| customer_id | UUID | FK → Customer | Customer (nullable for guest) |
| sale_number | string | not null, unique | Receipt/transaction ID |
| status | enum | not null | 'completed', 'refunded', 'voided' |
| subtotal | decimal | not null | Sum of line items |
| discount_amount | decimal | not null, default 0 | Total discount applied |
| loyalty_discount | decimal | not null, default 0 | Discount from points redemption |
| tax_amount | decimal | not null, default 0 | Tax amount |
| total | decimal | not null | Final total |
| total_cost | decimal | not null | Cost of goods sold |
| profit | decimal | not null | Total - total_cost |
| payment_method | string | nullable | Payment method used |
| notes | text | nullable | Sale notes |
| created_by | UUID | FK → User | Created by user |
| created_at | timestamp | not null | Creation timestamp |
| updated_at | timestamp | not null | Last update timestamp |

---

### SaleItem

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| sale_id | UUID | FK → Sale | Parent sale |
| product_id | UUID | FK → Product | Product sold |
| quantity | integer | not null | Quantity sold |
| unit_price | decimal | not null | Price per unit |
| unit_cost | decimal | not null | Cost per unit |
| discount | decimal | not null, default 0 | Line item discount |
| line_total | decimal | not null | Quantity × unit_price - discount |
| profit | decimal | not null | line_total - (quantity × unit_cost) |

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
├── ComplianceRecords (1:N)
├── Suppliers (1:N)
│   └── PurchaseOrders (1:N)
│       └── PurchaseOrderItems (1:N)
│           └── RawMaterials (N:1)
├── Products (1:N)
│   └── SaleItems (1:N)
│       └── Sales (N:1)
│           └── Customers (N:1)
```

---

## Indexes

- `recipes(store_id, name)` - Recipe lookup
- `batches(store_id, batch_number)` - Batch lookup
- `batches(status, steeping_completed_at)` - Steeping notifications
- `raw_materials(store_id, ingredient_id)` - Inventory lookup
- `inventory_transactions(raw_material_id, created_at)` - Stock history
- `compliance_records(batch_id, document_type)` - Compliance lookups
- `suppliers(store_id, name)` - Supplier lookup
- `purchase_orders(store_id, supplier_id, status)` - Purchase order lookups
- `purchase_orders(store_id, order_number)` - Order number lookup
- `products(store_id, sku)` - Product lookup by SKU
- `products(store_id, status)` - Active products lookup
- `sales(store_id, customer_id, created_at)` - Sales history
- `sales(store_id, created_at)` - Sales by date
- `sale_items(sale_id, product_id)` - Sale item lookups

---

## Soft Deletes

All primary entities (except transactions) use soft deletes:
- `deleted_at: timestamp | null`
- Queries filter by `deleted_at IS NULL` by default
