## Table of Contents

1. [Overview](#overview)
2. [Setup](#setup)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Environment Variables](#environment-variables)
3. [API Endpoints](#api-endpoints)
   - [Generate Chat Completion](#generate-chat-completion)
   - [Send Chats to User](#send-chats-to-user)
   - [Delete Chats](#delete-chats)
   - [Register User](#register-user)
   - [Login User](#login-user)
   - [Verify User](#verify-user)
   - [Logout User](#logout-user)
4. [Error Handling](#error-handling)
5. [Dependencies](#dependencies)
6. [Development](#development)
7. [License](#license)

---

## Overview

This project provides an API for users to interact with a chatbot powered by OpenAI's GPT model. The main features include sending messages, receiving responses, retrieving chat history, clearing chat history, and handling user authentication. This service is secured with JWT authentication.

---

## Setup

### Prerequisites

- Node.js (v14 or later)
- MongoDB (local or remote instance)
- OpenAI API Key
- JWT Secret Key

### Installation

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/your-repository/chat-api-service.git
   cd chat-api-service
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file in the root of your project directory and include the following:

   ```
   JWT_SECRET
   COOKIE_DOMAIN
   COOKIE_SECRET
   VITE_OPEN_AI_KEY
   DB_PASSWORD
   DB_NAME
   ENV
   PORT
   ALLOWED_ORIGINS

   ```

   - **JWT_SECRET**: Secret key for signing JWT tokens.
   - **COOKIE_DOMAIN**: Domain for the cookie to store JWT token.
   - **OPENAI_API_KEY**: Your OpenAI API key.
   - **MONGO_URI**: MongoDB connection string.

### Running the Application

Start the application in development mode:

```bash
npm run dev
```

This will start the server on `http://localhost:3000` by default.

For production, you can build and run using:

```bash
npm run build
npm start
```

---

## API Endpoints

### Generate Chat Completion

Generates a response from the OpenAI GPT model based on the user's message.

**Endpoint:** `POST /api/chat`

#### Request Body

```json
{
  "message": "How are you today?"
}
```

#### Response

```json
{
  "chats": [
    {
      "role": "user",
      "content": "How are you today?"
    },
    {
      "role": "assistant",
      "content": "I'm doing great, thank you for asking!"
    }
  ]
}
```

#### Error Response

- **401 Unauthorized**: User is not authenticated.

  - Body:
    ```json
    {
      "message": "User not registered OR Token malfunctioned"
    }
    ```

- **500 Internal Server Error**: Something went wrong while processing the request.

---

### Send Chats to User

Retrieves the chat history for the authenticated user.

**Endpoint:** `GET /api/chat`

#### Response

```json
{
  "message": "OK",
  "chats": [
    {
      "role": "user",
      "content": "How are you today?"
    },
    {
      "role": "assistant",
      "content": "I'm doing great, thank you for asking!"
    }
  ]
}
```

#### Error Response

- **401 Unauthorized**: User is not authenticated.
- **403 Forbidden**: Permissions don't match the token.

---

### Delete Chats

Clears all chat history for the authenticated user.

**Endpoint:** `DELETE /api/chat`

#### Response

```json
{
  "message": "OK"
}
```

#### Error Response

- **401 Unauthorized**: User is not authenticated.
- **403 Forbidden**: Permissions don't match the token.

---

### Register User

Registers a new user. Returns a JWT token and sets it as a cookie upon successful registration.

**Endpoint:** `POST /api/auth/register`

#### Request Body

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

#### Response

- **201 Created**: User created successfully.

  ```json
  {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "token": "jwt_token"
  }
  ```

- **400 Bad Request**: Invalid data or missing fields.

  ```json
  {
    "message": "Please add all fields"
  }
  ```

- **400 Bad Request**: User already exists.
  ```json
  {
    "message": "User already exists"
  }
  ```

---

### Login User

Logs in a user by verifying email and password, and returns a JWT token set as a cookie.

**Endpoint:** `POST /api/auth/login`

#### Request Body

```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

#### Response

- **200 OK**: User logged in successfully.

  ```json
  {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "token": "jwt_token"
  }
  ```

- **400 Bad Request**: Invalid credentials.
  ```json
  {
    "message": "Invalid credentials"
  }
  ```

---

### Verify User

Verifies the current authenticated user's token and retrieves user information.

**Endpoint:** `GET /api/auth/verify`

#### Response

- **200 OK**: User verified successfully.

  ```json
  {
    "message": "OK",
    "name": "John Doe",
    "email": "john.doe@example.com"
  }
  ```

- **401 Unauthorized**: Invalid token or user not found.
  ```json
  {
    "message": "User not registered OR Token malfunctioned"
  }
  ```

---

### Logout User

Logs out the user by clearing the authentication token cookie.

**Endpoint:** `POST /api/auth/logout`

#### Response

- **200 OK**: User logged out successfully.

  ```json
  {
    "message": "OK",
    "name": "John Doe",
    "email": "john.doe@example.com"
  }
  ```

- **401 Unauthorized**: Invalid token or user not found.
  ```json
  {
    "message": "User not registered OR Token malfunctioned"
  }
  ```

---

## Error Handling

The API returns appropriate HTTP status codes for different errors:

- **401 Unauthorized**: The user is not authenticated or the JWT token is invalid.
- **403 Forbidden**: The JWT token does not match the user’s expected ID.
- **500 Internal Server Error**: If something unexpected happens, such as issues with the database or external API.

---

## Dependencies

To install dependencies:

```bash
npm install
```

---

## Development

### Running Tests

If you have test scripts, you can run them using:

```bash
npm run test
```

### Linting

To ensure code quality and consistency, we use [ESLint](https://eslint.org/). To run the linter:

```bash
npm run lint
```

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

### Additional Notes:

- Ensure that your **OpenAI API Key** is set up correctly for the chatbot generation to work.
- MongoDB must be accessible (either locally or remotely), and the **MONGO_URI** should point to your database.
- For production environments, set **ENV** to `"production"` and ensure cookies are handled with the **`secure`** flag for HTTPS.

---

```

### Summary of New Endpoints:
- **`POST /api/auth/register`**: Registers a new user, creates a JWT token, and sets it as a cookie.
- **`POST /api/auth/login`**: Logs in a user, verifies credentials, creates a JWT token, and sets it as a cookie.
- **`GET /api/auth/verify`**: Verifies the authenticated user's token and retrieves user information.
- **`POST /api/auth/logout`**: Logs out the user by clearing the JWT token

 cookie.

These new endpoints are now documented under the **API Endpoints** section. You can copy and paste this README into your project’s `README.md` file.
```
