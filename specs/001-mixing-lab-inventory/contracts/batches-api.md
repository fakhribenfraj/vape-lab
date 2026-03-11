# API Contract: Batches

Base path: `/api/batches`

## List Batches

**GET** `/api/batches`

Query Parameters:
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| status | enum | No | Filter by status |
| recipeId | UUID | No | Filter by recipe |
| fromDate | date | No | Created after |
| toDate | date | No | Created before |
| page | integer | No | Page number |
| limit | integer | No | Items per page |

Response:
```json
{
  "data": [
    {
      "id": "uuid",
      "batchNumber": "BATCH-2026-001",
      "recipeId": "uuid",
      "recipeName": "Fruit Blast",
      "status": "steeping",
      "steepingCompletedAt": "2026-03-13T10:00:00Z",
      "createdAt": "2026-03-10T10:00:00Z"
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 100 }
}
```

## Get Batch

**GET** `/api/batches/:id`

Response:
```json
{
  "id": "uuid",
  "storeId": "uuid",
  "recipeId": "uuid",
  "recipeVersion": 1,
  "batchNumber": "BATCH-2026-001",
  "status": "steeping",
  "startedAt": "2026-03-10T10:00:00Z",
  "completedAt": "2026-03-10T10:30:00Z",
  "steepingStartedAt": "2026-03-10T10:30:00Z",
  "steepingCompletedAt": "2026-03-13T10:30:00Z",
  "ingredients": [
    {
      "ingredientId": "uuid",
      "name": "PG",
      "actualAmount": 50.0,
      "targetAmount": 50.0,
      "variance": 0.0,
      "unit": "ml"
    }
  ],
  "notes": "First batch - adjusted for temperature",
  "createdBy": "uuid",
  "createdAt": "2026-03-10T10:00:00Z"
}
```

## Create Batch

**POST** `/api/batches`

Request:
```json
{
  "recipeId": "uuid",
  "notes": "optional notes"
}
```

Behavior:
- Creates batch in "pending" status
- Generates unique batch number
- Links to current recipe version
- Reserves ingredients from inventory

Response (201):
```json
{
  "id": "uuid",
  "batchNumber": "BATCH-2026-001",
  "status": "pending",
  "message": "Batch created"
}
```

## Start Mixing

**POST** `/api/batches/:id/start`

Request:
```json
{
  "actualIngredients": [
    {
      "ingredientId": "uuid",
      "rawMaterialId": "uuid",
      "actualAmount": 50.0
    }
  ]
}
```

Behavior:
- Validates ingredients available in inventory
- Records actual amounts used
- Calculates variance from recipe targets
- Deducts from inventory
- Sets status to "mixing" → "steeping"

Response (200):
```json
{
  "id": "uuid",
  "status": "steeping",
  "steepingCompletedAt": "2026-03-13T10:30:00Z",
  "message": "Batch mixing completed"
}
```

## Complete Steeping

**POST** `/api/batches/:id/complete-steeping`

Behavior:
- Sets status to "ready"
- Updates steeping_completed_at
- Triggers notifications

Response (200):
```json
{
  "id": "uuid",
  "status": "ready",
  "message": "Steeping completed"
}
```

## Cancel Batch

**POST** `/api/batches/:id/cancel`

Request:
```json
{
  "reason": "Quality issue - wrong color"
}
```

Behavior:
- Restores inventory if ingredients were used
- Sets status to "cancelled"
- Preserves audit trail

## Get Traceability

**GET** `/api/batches/:id/traceability`

Response:
```json
{
  "batch": { "id": "uuid", "batchNumber": "string", "status": "completed" },
  "recipe": { "id": "uuid", "name": "string", "version": 1 },
  "ingredients": [
    {
      "name": "PG",
      "actualAmount": 50.0,
      "rawMaterial": {
        "lotNumber": "LOT-123",
        "supplier": "Supplier Name",
        "expiryDate": "2027-01-01"
      }
    }
  ],
  "createdBy": { "name": "John", "role": "technician" },
  "createdAt": "2026-03-10T10:00:00Z"
}
```
