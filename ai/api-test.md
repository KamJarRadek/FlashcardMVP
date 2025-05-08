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
- **Description:** Generate up to 20 flashcard proposals (“definition”–“concept”) from input text (max 10 000 characters).
- **Request Body:**
  ```json
  {
    "text": "string",
    "maxCount": number
  }

* **Response Body:**

  ```json
  {
    "proposals": [
      {
        "definition": "string",
        "concept": "string"
      }
      // … up to maxCount items
    ]
  }
  ```
* **Success:** `200 OK`
* **Errors:**

  * `400 Bad Request` — invalid input text or maxCount out of range
  * `429 Too Many Requests` — rate limit exceeded

#### Accept Generated Proposals

* **Method:** `POST`
* **URL:** `/flashcards`
* **Description:** Accept a set of AI-generated proposals and persist them as user flashcards.
* **Request Body:**

  ```json
  {
    "userId": "uuid",
    "proposals": [
      {
        "definition": "string",
        "concept": "string"
      }
    ]
  }
  ```
* **Response Body:**

  ```json
  {
    "created": [
      {
        "id": "uuid",
        "definition": "string",
        "concept": "string",
        "status": "accepted",
        "source": "AI"
      }
    ]
  }
  ```
* **Success:** `201 Created`
* **Errors:**

  * `400 Bad Request` — missing or invalid proposal data
  * `401 Unauthorized` — missing or invalid session token

#### Create Flashcard (Manual)

* **Method:** `POST`
* **URL:** `/flashcards/manual`
* **Description:** Create a flashcard manually.
* **Request Body:**

  ```json
  {
    "userId": "uuid",
    "definition": "string",
    "concept": "string"
  }
  ```
* **Response Body:** Same as “Accept Generated Proposals”
* **Success:** `201 Created`
* **Errors:**

  * `400 Bad Request`
  * `401 Unauthorized`

#### List Flashcards

* **Method:** `GET`
* **URL:** `/flashcards`
* **Description:** Retrieve a paginated list of user flashcards.
* **Query Params:**

  * `page`: number (default: 1)
  * `pageSize`: number (default: 20)
* **Response Body:**

  ```json
  {
    "items": [
      {
        "id": "uuid",
        "definition": "string",
        "concept": "string",
        "status": "accepted" | "rejected",
        "source": "AI" | "manual"
      }
    ],
    "total": number,
    "page": number,
    "pageSize": number
  }
  ```
* **Success:** `200 OK`
* **Errors:**

  * `401 Unauthorized`

#### Update Flashcard

* **Method:** `PATCH`
* **URL:** `/flashcards/:id`
* **Description:** Update status or fields of a flashcard.
* **Request Body:**

  ```json
  {
    "status"?: "accepted" | "rejected",
    "definition"?: "string",
    "concept"?: "string"
  }
  ```
* **Response Body:** Updated flashcard object
* **Success:** `200 OK`
* **Errors:**

  * `400 Bad Request`
  * `401 Unauthorized`
  * `404 Not Found`

#### Delete Flashcard

* **Method:** `DELETE`
* **URL:** `/flashcards/:id`
* **Description:** Delete a flashcard.
* **Success:** `204 No Content`
* **Errors:**

  * `401 Unauthorized`
  * `404 Not Found`

#### Study Mode

* **Method:** `GET`
* **URL:** `/flashcards/study`
* **Description:** Fetch next batch of flashcards for study session.
* **Query Params:**

  * `count`: number (default: 10)
* **Response Body:**

  ```json
  {
    "cards": [
      {
        "id": "uuid",
        "definition": "string",
        "concept": "string"
      }
    ]
  }
  ```
* **Success:** `200 OK`
* **Errors:**

  * `401 Unauthorized`

### Statistics

#### Get Usage Statistics

* **Method:** `GET`
* **URL:** `/stats`
* **Description:** Returns aggregated usage metrics for the authenticated user.
* **Response Body:**

  ```json
  {
    "totalFlashcards": number,
    "accepted": number,
    "rejected": number,
    "lastStudyDate": "timestamp"
  }
  ```
* **Success:** `200 OK`
* **Errors:**

  * `401 Unauthorized`

### Authentication

#### Login

* **Method:** `POST`
* **URL:** `/auth/login`
* **Description:** Authenticate with email and password.
* **Request Body:**

  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
* **Response Body:**

  ```json
  {
    "session": {
      "access_token": "string",
      "refresh_token": "string",
      "user": {
        "id": "uuid",
        "email": "string"
      }
    }
  }
  ```
* **Success:** `200 OK`
* **Errors:**

  * `400 Bad Request`
  * `401 Unauthorized`

#### OAuth

* **Method:** `POST`
* **URL:** `/auth/oauth`
* **Description:** Authenticate via third-party providers (e.g., Google, GitHub).
* **Request Body:**

  ```json
  {
    "provider": "string",
    "token": "string"
  }
  ```
* **Response Body:** Same as Login
* **Success:** `200 OK`
* **Errors:**

  * `400 Bad Request`
  * `401 Unauthorized`

#### Sign Up

* **Method:** `POST`
* **URL:** `/auth/signup`
* **Description:** Create a new user account. After signup, a confirmation email is sent.
* **Request Body:**

  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
* **Response Body:**

  ```json
  {
    "user": {
      "id": "uuid",
      "email": "string",
      "confirmed_at": "timestamp | null"
    }
  }
  ```
* **Success:** `200 OK`
* **Errors:**

  * `400 Bad Request` — invalid email/password
  * `409 Conflict` — email already registered

#### Recover Password

* **Method:** `POST`
* **URL:** `/auth/recover`
* **Description:** Send a password reset link to the specified email.
* **Request Body:**

  ```json
  {
    "email": "string"
  }
  ```
* **Response Body:**

  ```json
  {
    "message": "Password reset link sent"
  }
  ```
* **Success:** `200 OK`
* **Errors:**

  * `400 Bad Request` — invalid email

#### Reset Password

* **Method:** `POST`
* **URL:** `/auth/reset`
* **Description:** Set a new password using the token from the reset link.
* **Request Body:**

  ```json
  {
    "token": "string",
    "newPassword": "string"
  }
  ```
* **Response Body:**

  ```json
  {
    "message": "Password has been reset"
  }
  ```
* **Success:** `200 OK`
* **Errors:**

  * `400 Bad Request` — invalid or expired token, weak password
  * `401 Unauthorized` — token expired or invalid

## 3. Authentication and Authorization

* **Mechanism:** Supabase Auth with JWT tokens
* **Protected Endpoints:** All routes except:

  * `/auth/login`, `/auth/oauth`
  * `/auth/signup`, `/auth/recover`, `/auth/reset`
* **Password Reset:** Full password reset flow via `/auth/recover` and `/auth/reset` endpoints
* **Row Level Security:** Supabase RLS ensures users can only access their own data (claim `user_id` mapping)

## 4. Validation and Business Logic

* **Text Generation Input:**

  * `text` ≤ 10 000 characters
  * `maxCount` ≤ 20

* **Flashcard Fields:**

  * `definition`: non-empty string (TEXT NOT NULL)
  * `concept`: non-empty string (TEXT NOT NULL)
  * `status`: `'accepted'` | `'rejected'` (DB CHECK)
  * `source`: `'AI'` | `'manual'` (DB CHECK)

* **Row Level Security:** Ensures users can only access their own flashcards via Supabase’s JWT claims

* **Indexing:** Queries on `flashcards` are optimized by indexes on `user_id`, `status`, and `source`

* **Rate Limiting:** Apply per-user rate limits on `/flashcards/generate` to prevent abuse

* **Logging (Internal):** All generate operations are recorded in an audit log table for monitoring (no public endpoint)
