# API Documentation

Complete reference for the VerseFlow REST API.

## 🔗 Base URL

```
Development: http://localhost:3000/api
Production:  https://api.verseflow.app (when deployed)
```

## 🔐 Authentication

VerseFlow uses JWT (JSON Web Tokens) for authentication.

### Authentication Flow

1. **Login** with credentials to receive JWT token
2. **Include token** in Authorization header for protected routes
3. **Token expires** after configured time (default: 24 hours)

```http
Authorization: Bearer <jwt_token>
```

## 📊 Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": <response_data>,
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "hasMore": true
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": {
    "field": "validation error details"
  }
}
```

## 🎵 Beats API

### Get All Beats

Retrieve a list of beats with optional filtering and pagination.

```http
GET /api/beats
```

#### Query Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `page` | number | Page number for pagination | 1 |
| `limit` | number | Number of items per page | 20 |
| `mood` | string | Filter by mood (Hype, Chill, Dark, etc.) | - |
| `key` | string | Filter by musical key | - |
| `bpm` | number | Filter by BPM | - |
| `bpmMin` | number | Minimum BPM for range filter | - |
| `bpmMax` | number | Maximum BPM for range filter | - |
| `producer` | string | Filter by producer name | - |
| `search` | string | Search in title and producer | - |
| `sort` | string | Sort field (title, bpm, created_at) | created_at |
| `order` | string | Sort order (asc, desc) | desc |

#### Example Request

```bash
curl -X GET "http://localhost:3000/api/beats?mood=Hype&bpmMin=120&bpmMax=140&page=1&limit=10"
```

#### Example Response

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Fire Trap Beat",
      "producer": "BeatMaker123",
      "artwork": "https://example.com/artwork1.jpg",
      "bpm": 130,
      "key": "Amin",
      "mood": "Hype",
      "leasePrice": 25,
      "exclusivePrice": 200,
      "audioSrc": "https://example.com/beat1.mp3",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "hasMore": true
  }
}
```

### Get Beat by ID

Retrieve a specific beat by its ID.

```http
GET /api/beats/:id
```

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | Beat ID |

#### Example Request

```bash
curl -X GET "http://localhost:3000/api/beats/1"
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Fire Trap Beat",
    "producer": "BeatMaker123",
    "artwork": "https://example.com/artwork1.jpg",
    "bpm": 130,
    "key": "Amin",
    "mood": "Hype",
    "leasePrice": 25,
    "exclusivePrice": 200,
    "audioSrc": "https://example.com/beat1.mp3",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Create Beat

Create a new beat (requires authentication).

```http
POST /api/beats
```

#### Request Headers

```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

#### Request Body

```json
{
  "title": "New Beat Title",
  "artwork": "https://example.com/artwork.jpg",
  "bpm": 140,
  "key": "Cmaj",
  "mood": "Energetic",
  "leasePrice": 30,
  "exclusivePrice": 250,
  "audioSrc": "https://example.com/beat.mp3"
}
```

#### Example Request

```bash
curl -X POST "http://localhost:3000/api/beats" \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Beat Title",
    "bpm": 140,
    "key": "Cmaj",
    "mood": "Energetic",
    "leasePrice": 30,
    "exclusivePrice": 250
  }'
```

### Update Beat

Update an existing beat (requires authentication and ownership).

```http
PUT /api/beats/:id
```

#### Request Body

Same as Create Beat, but all fields are optional.

### Delete Beat

Delete a beat (requires authentication and ownership).

```http
DELETE /api/beats/:id
```

## 🤝 Projects API

### Get All Projects

Retrieve collaboration projects with filtering.

```http
GET /api/projects
```

#### Query Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `page` | number | Page number | 1 |
| `limit` | number | Items per page | 20 |
| `skill` | string | Filter by required skill | - |
| `search` | string | Search in title and description | - |
| `status` | string | Filter by project status | open |

#### Example Response

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Need Rapper for Trap Song",
      "description": "Looking for a skilled rapper to collaborate on a high-energy trap song.",
      "postedBy": 5,
      "requiredSkills": ["Rapping"],
      "status": "open",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "total": 12,
    "page": 1,
    "limit": 20,
    "hasMore": false
  }
}
```

### Get Project by ID

```http
GET /api/projects/:id
```

### Create Project

Create a new collaboration project (requires authentication).

```http
POST /api/projects
```

#### Request Body

```json
{
  "title": "Project Title",
  "description": "Detailed project description",
  "requiredSkills": ["Rapping", "Vocals"]
}
```

### Update Project

```http
PUT /api/projects/:id
```

### Delete Project

```http
DELETE /api/projects/:id
```

## 👤 Users API

### Get User Profile

Get the current user's profile (requires authentication).

```http
GET /api/users/profile
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://example.com/avatar.jpg",
    "skills": ["Rapping", "Songwriting"],
    "bio": "Passionate rapper and songwriter",
    "location": "Los Angeles, CA",
    "socialLinks": {
      "soundcloud": "johndoe",
      "instagram": "@johndoe"
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "lastActive": "2024-01-15T12:00:00Z"
  }
}
```

### Update User Profile

Update the current user's profile (requires authentication).

```http
PUT /api/users/profile
```

#### Request Body

```json
{
  "name": "Updated Name",
  "bio": "Updated bio",
  "skills": ["Rapping", "Production"],
  "location": "New York, NY",
  "socialLinks": {
    "soundcloud": "newusername"
  }
}
```

## 🔐 Authentication API

### Login

Authenticate user and receive JWT token.

```http
POST /api/auth/login
```

#### Request Body

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "https://example.com/avatar.jpg"
    }
  }
}
```

### Register

Create a new user account.

```http
POST /api/auth/register
```

#### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "skills": ["Rapping"]
}
```

### SoundCloud Login

Authenticate via SoundCloud (simulation for demo).

```http
POST /api/auth/soundcloud
```

## 🤖 AI API

### Get Beat Recommendations

Get AI-powered beat recommendations (requires authentication).

```http
POST /api/ai/recommendations
```

#### Request Body

```json
{
  "mood": "Hype",
  "bpm": 130,
  "key": "Amin",
  "limit": 10
}
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "id": 1,
        "title": "Fire Trap Beat",
        "confidence": 0.95,
        "reason": "Matches your preferred mood and BPM range"
      }
    ],
    "suggestions": {
      "bpm": 130,
      "key": "Amin",
      "mood": "Hype"
    }
  }
}
```

### Get Style Analysis

Analyze a beat's musical characteristics.

```http
POST /api/ai/analyze
```

#### Request Body

```json
{
  "audioUrl": "https://example.com/beat.mp3"
}
```

## 📝 Data Types

### Enums

#### Mood
```typescript
enum Mood {
  Hype = 'Hype',
  Chill = 'Chill',
  Dark = 'Dark',
  Sad = 'Sad',
  Energetic = 'Energetic',
  Soulful = 'Soulful',
  Experimental = 'Experimental'
}
```

#### Key
```typescript
enum Key {
  Cmaj = 'Cmaj', Cmin = 'Cmin',
  Dmaj = 'Dmaj', Dmin = 'Dmin',
  Emaj = 'Emaj', Emin = 'Emin',
  Fmaj = 'Fmaj', Fmin = 'Fmin',
  Gmaj = 'Gmaj', Gmin = 'Gmin',
  Amaj = 'Amaj', Amin = 'Amin',
  Bmaj = 'Bmaj', Bmin = 'Bmin'
}
```

#### Skill
```typescript
enum Skill {
  Rapping = 'Rapping',
  Vocals = 'Vocals',
  Production = 'Production',
  Mixing = 'Mixing',
  Mastering = 'Mastering',
  Songwriting = 'Songwriting'
}
```

## 🚫 Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable Entity | Validation errors |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

## 📋 Request/Response Examples

### Filtering and Pagination

```bash
# Get beats with multiple filters
curl -X GET "http://localhost:3000/api/beats?mood=Hype&bpmMin=120&bpmMax=140&key=Amin&page=2&limit=5"

# Search beats
curl -X GET "http://localhost:3000/api/beats?search=trap&sort=bpm&order=asc"

# Get projects by skill
curl -X GET "http://localhost:3000/api/projects?skill=Rapping&status=open"
```

### Authentication Examples

```bash
# Login
curl -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# Access protected route
curl -X GET "http://localhost:3000/api/users/profile" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 🔄 Rate Limiting

API endpoints are rate-limited to ensure fair usage:

- **General endpoints**: 100 requests per 15 minutes
- **Authentication**: 5 requests per 15 minutes
- **File uploads**: 10 requests per hour

Rate limit headers are included in responses:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## 🛠️ Development Tools

### API Testing

Use these tools to test the API:

- **Postman Collection**: [Download](postman_collection.json)
- **Insomnia Workspace**: [Import](insomnia_workspace.json)
- **cURL Examples**: See above sections

### SDK and Libraries

- **JavaScript/TypeScript**: Built-in fetch API examples
- **Python**: `requests` library examples available
- **Node.js**: `axios` examples in repository

---

This API documentation is version-controlled and updated with each release. For the latest changes, check the [CHANGELOG.md](../CHANGELOG.md) file.