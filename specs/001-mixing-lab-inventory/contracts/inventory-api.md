# API Contract: Inventory

Base path: `/api/inventory`

## List Inventory

**GET** `/api/inventory`

Query Parameters:
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| type | enum | No | Filter by ingredient type |
| lowStock | boolean | No | Only low stock items |
| page | integer | No | Page number |
| limit | integer | No | Items per page |

Response:
```json
{
  "data": [
    {
      "id": "uuid",
      "ingredientId": "uuid",
      "ingredientName": "PG",
      "type": "pg",
      "currentStock": 450.0,
      "unit": "ml",
      "reorderThreshold": 100.0,
      "isLowStock": false,
      "costPerUnit": 0.05,
      "supplier": "ChemSupply Co",
      "updatedAt": "2026-03-10T10:00:00Z"
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 10 }
}
```

## Get Inventory Item

**GET** `/api/inventory/:id`

Response:
```json
{
  "id": "uuid",
  "ingredientId": "uuid",
  "ingredient": { "id": "uuid", "name": "PG", "type": "pg" },
  "currentStock": 450.0,
  "unit": "ml",
  "reorderThreshold": 100.0,
  "isLowStock": false,
  "costPerUnit": 0.05,
  "lotNumber": "LOT-123",
  "supplier": "ChemSupply Co",
  "expiryDate": "2027-01-01",
  "transactions": [
    {
      "id": "uuid",
      "type": "receive",
      "quantity": 500.0,
      "notes": "New shipment",
      "createdAt": "2026-03-01T10:00:00Z"
    }
  ],
  "updatedAt": "2026-03-10T10:00:00Z"
}
```

## Receive Inventory

**POST** `/api/inventory/:id/receive`

Request:
```json
{
  "quantity": 500.0,
  "lotNumber": "LOT-456",
  "costPerUnit": 0.05,
  "supplier": "New Supplier",
  "expiryDate": "2027-06-01",
  "notes": "New shipment"
}
```

Validation:
- quantity > 0
- expiryDate must be future date

Behavior:
- Adds to current_stock
- Creates inventory transaction
- Triggers reorder check

Response (201):
```json
{
  "id": "uuid",
  "currentStock": 950.0,
  "message": "Inventory received"
}
```

## Adjust Inventory

**POST** `/api/inventory/:id/adjust`

Request:
```json
{
  "quantity": -10.0,
  "reason": "Measurement error correction"
}
```

Validation:
- quantity != 0
- |quantity| <= currentStock for deductions

Behavior:
- Creates adjustment transaction
- Logs reason for audit

## Get Low Stock Alerts

**GET** `/api/inventory/alerts`

Response:
```json
{
  "alerts": [
    {
      "id": "uuid",
      "ingredientName": "Nicotine",
      "currentStock": 50.0,
      "reorderThreshold": 100.0,
      "shortage": 50.0,
      "unit": "ml"
    }
  ]
}
```

## Get Inventory History

**GET** `/api/inventory/:id/history`

Query: fromDate, toDate

Response:
```json
{
  "transactions": [
    {
      "id": "uuid",
      "type": "use",
      "quantity": -50.0,
      "batchNumber": "BATCH-2026-001",
      "notes": "Used in batch",
      "createdBy": "John",
      "createdAt": "2026-03-10T10:30:00Z"
    }
  ],
  "summary": {
    "openingStock": 500.0,
    "received": 500.0,
    "used": 100.0,
    "adjustments": -10.0,
    "closingStock": 890.0
  }
}
```

## Update Thresholds

**PATCH** `/api/inventory/:id/thresholds**

Request:
```json
{
  "reorderThreshold": 150.0
}
```
