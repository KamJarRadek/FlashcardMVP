# REST API Plan

## 1. Resources
- **User** — `users` table
- **Flashcard** — `flashcards` table
- **Authentication** — login and OAuth
- **Statistics** — aggregated usage metrics

## 2. Endpoints

### Flashcards

#### Generate Proposals
- **Method:** `POST`
- **URL:** `/flashcards/generate`
- **Description:** Generate up to 20 flashcard proposals (“definition”-“concept”) from input text (max 10 000 characters).
- **Request Body:**
  ```json
  {
    "text": "string (max 10000 chars)",
    "maxCount": 20
  }
  ```
- **Response Body:**
  ```json
  {
    "proposals": [
      {
        "definition": "string",
        "concept": "string"
      }
    ]
  }
  ```
- **Success:** `200 OK`
- **Errors:**
  - `400 Bad Request` — missing or too-long text, invalid maxCount
  - `401 Unauthorized`
  - `429 Too Many Requests` — rate limit exceeded

#### Accept Generated Proposals
- **Method:** `POST`
- **URL:** `/flashcards`
- **Description:** Accept and store selected AI-generated proposals.
- **Request Body:**
  ```json
  {
    "proposals": [
      {
        "definition": "string",
        "concept": "string"
      }
    ]
  }
  ```
- **Response Body:**
  ```json
  {
    "items": [
      {
        "id": "uuid",
        "definition": "string",
        "concept": "string",
        "status": "accepted",
        "source": "AI",
        "created_at": "timestamp"
      }
    ]
  }
  ```
- **Success:** `201 Created`
- **Errors:**
  - `400 Bad Request` — invalid proposals array
  - `401 Unauthorized`

#### Create Flashcard (Manual)
- **Method:** `POST`
- **URL:** `/flashcards/manual`
- **Description:** Create a manual flashcard.
- **Request Body:**
  ```json
  {
    "definition": "string",
    "concept": "string"
  }
  ```
- **Response Body:**
  ```json
  {
    "id": "uuid",
    "definition": "string",
    "concept": "string",
    "status": "accepted",
    "source": "manual",
    "created_at": "timestamp"
  }
  ```
- **Success:** `201 Created`
- **Errors:**
  - `400 Bad Request` — missing fields or invalid data
  - `401 Unauthorized`

#### List Flashcards
- **Method:** `GET`
- **URL:** `/flashcards`
- **Description:** Retrieve current user’s flashcards with filtering, sorting, and pagination.
- **Query Parameters:**
  - `status` (`accepted` | `rejected`)
  - `source` (`AI` | `manual`)
  - `page` (integer, default 1)
  - `limit` (integer, default 20)
  - `sortBy` (`created_at` | `updated_at`)
  - `order` (`asc` | `desc`)
- **Response Body:**
  ```json
  {
    "items": [
      {
        "id": "uuid",
        "definition": "string",
        "concept": "string",
        "status": "accepted" ,
        "source": "AI" ,
        "created_at": "timestamp",
        "updated_at": "timestamp"
      }
    ], 
    "meta": {
      "page": 1,
      "limit": 20,
      "total": 50
    }
  }
  ```
- **Success:** `200 OK`
- **Errors:**
  - `401 Unauthorized`

#### Update Flashcard
- **Method:** `PATCH`
- **URL:** `/flashcards/{id}`
- **Description:** Update definition, concept, or status (accept/reject) of a flashcard.
- **Request Body:** (any combination)
  ```json
  {
    "definition": "string",
    "concept": "string",
    "status": "accepted"  
  }
  ```
- **Response Body:** Updated flashcard object
- **Success:** `200 OK`
- **Errors:**
  - `400 Bad Request`
  - `401 Unauthorized`
  - `404 Not Found`

#### Delete Flashcard
- **Method:** `DELETE`
- **URL:** `/flashcards/{id}`
- **Description:** Remove a flashcard.
- **Success:** `204 No Content`
- **Errors:**
  - `401 Unauthorized`
  - `404 Not Found`

#### Study Mode
- **Method:** `GET`
- **URL:** `/flashcards/study`
- **Description:** Retrieve a random set of flashcards for learning.
- **Query Parameters:**
  - `limit` (integer, default 20)
- **Response Body:**
  ```json
  {
    "items": [ 
      {
        "id": "uuid",
        "definition": "string",
        "concept": "string"
      }
    ] 
  }
  ```
- **Success:** `200 OK`
- **Errors:**
  - `401 Unauthorized`

### Statistics

#### Get Usage Statistics
- **Method:** `GET`
- **URL:** `/stats`
- **Description:** Get counts of flashcards by source and status for the current user.
- **Response Body:**
  ```json
  {
    "bySource": {
      "AI": 10,
      "manual": 5
    },
    "byStatus": {
      "accepted": 8,
      "rejected": 7
    }
  }
  ```
- **Success:** `200 OK`
- **Errors:**
  - `401 Unauthorized`

### Authentication

#### Login
- **Method:** `POST`
- **URL:** `/auth/login`
- **Description:** Authenticate with email and password.
- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response Body:**
  ```json
  {
    "accessToken": "jwt",
    "user": {
      "id": "uuid",
      "email": "string"
    }
  }
  ```
- **Success:** `200 OK`
- **Errors:**
  - `400 Bad Request`
  - `401 Unauthorized`

#### OAuth
- **Method:** `POST`
- **URL:** `/auth/oauth`
- **Description:** Authenticate via OAuth provider.
- **Request Body:**
  ```json
  {
    "provider": "string",
    "token": "string"
  }
  ```
- **Response Body:** Same as Login
- **Success:** `200 OK`
- **Errors:**
  - `400 Bad Request`
  - `401 Unauthorized`

---

## 3. Authentication and Authorization
- **Mechanism:** Supabase Auth with JWT tokens
- **Protected Endpoints:** All `/flashcards/*`, `/stats`, `/flashcards/generate`, `/flashcards/study`
- **Authorization:**
  - JWT claim `user_id` mapped to `flashcards.user_id` via PostgreSQL Row Level Security
- **Password Reset:** Not implemented in MVP

## 4. Validation and Business Logic
- **Text Generation Input:**
  - `text` ≤ 10 000 characters
  - `maxCount` ≤ 20

- **Flashcard Fields:**
  - `definition`: non-empty string (TEXT NOT NULL)
  - `concept`: non-empty string (TEXT NOT NULL)
  - `status`: `'accepted'` | `'rejected'` (DB CHECK)
  - `source`: `'AI'` | `'manual'` (DB CHECK)

- **Row Level Security:** Ensures users can only access their own flashcards via Supabase’s JWT claims
- **Indexing:** Queries on `flashcards` are optimized by indexes on `user_id`, `status`, and `source`
- **Rate Limiting:** Apply per-user rate limits on `/flashcards/generate` to prevent abuse
- **Logging (Internal):** All generate operations are recorded in an audit log table for monitoring (no public endpoint)  
