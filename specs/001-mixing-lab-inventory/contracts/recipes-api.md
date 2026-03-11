# API Contract: Recipes

Base path: `/api/recipes`

## List Recipes

**GET** `/api/recipes`

Query Parameters:
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| search | string | No | Search by name |
| status | enum | No | Filter by status |
| page | integer | No | Page number (default: 1) |
| limit | integer | No | Items per page (default: 20) |

Response:
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "version": 1,
      "steepingDurationHours": 72,
      "targetNicotineMg": 3.0,
      "targetPgRatio": 50.0,
      "targetVgRatio": 50.0,
      "status": "active",
      "ingredientCount": 5,
      "createdAt": "2026-03-10T10:00:00Z",
      "updatedAt": "2026-03-10T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

## Get Recipe

**GET** `/api/recipes/:id`

Response:
```json
{
  "id": "uuid",
  "storeId": "uuid",
  "name": "string",
  "version": 1,
  "description": "string",
  "steepingDurationHours": 72,
  "targetNicotineMg": 3.0,
  "targetPgRatio": 50.0,
  "targetVgRatio": 50.0,
  "status": "active",
  "ingredients": [
    {
      "id": "uuid",
      "ingredientId": "uuid",
      "name": "PG",
      "type": "pg",
      "targetAmount": 50.0,
      "unit": "ml",
      "orderIndex": 0
    }
  ],
  "createdBy": "uuid",
  "createdAt": "2026-03-10T10:00:00Z",
  "updatedAt": "2026-03-10T10:00:00Z"
}
```

## Create Recipe

**POST** `/api/recipes`

Request:
```json
{
  "name": "string",
  "description": "string",
  "steepingDurationHours": 72,
  "targetNicotineMg": 3.0,
  "targetPgRatio": 50.0,
  "targetVgRatio": 50.0,
  "ingredients": [
    {
      "ingredientId": "uuid",
      "targetAmount": 50.0,
      "orderIndex": 0
    }
  ]
}
```

Validation (Zod):
- name: min 1, max 100 characters
- steepingDurationHours: min 0, max 168 (7 days)
- targetNicotineMg: min 0, max 20 (EU TPD)
- targetPgRatio + targetVgRatio = 100
- ingredients: min 1 item

Response (201):
```json
{
  "id": "uuid",
  "message": "Recipe created successfully"
}
```

## Update Recipe

**PATCH** `/api/recipes/:id`

Request: Same as Create, all fields optional

Behavior:
- Creates new version (increments version)
- Preserves previous versions
- Archives old active version if status changes

Response (200):
```json
{
  "id": "uuid",
  "version": 2,
  "message": "Recipe updated successfully"
}
```

## Delete Recipe

**DELETE** `/api/recipes/:id`

Behavior: Soft delete (sets deletedAt)

Response (204): No content

## Get Recipe Versions

**GET** `/api/recipes/:id/versions`

Response:
```json
{
  "versions": [
    { "version": 1, "createdAt": "2026-01-01T10:00:00Z", "createdBy": "uuid" },
    { "version": 2, "createdAt": "2026-03-10T10:00:00Z", "createdBy": "uuid" }
  ]
}
```
