# IMFgadgetAPI 

## Overview

The **Gadgets API** is designed to manage gadgets securely with authentication using JWT (JSON Web Token). This API allows users to register, log in, and perform CRUD operations on gadgets, including updating their status and initiating a self-destruct sequence.

## Base URL

```
https://imfgadgetapi.onrender.com
```

## Authentication

The API uses **Bearer Token Authentication**. Include the token in the `Authorization` header:

```
Authorization: Bearer <your_token>
```

## Endpoints

### Authentication

#### 1. Register a New User

**Endpoint:** `POST /auth/register`

**Request Body:**

```json
{
  "username": "exampleUser",
  "password": "examplePassword"
}
```

**Responses:**

- `200 OK` - User registered successfully
- `400 Bad Request` - Username and password are required
- `500 Internal Server Error` - Server error

#### 2. User Login

**Endpoint:** `POST /auth/login`

**Request Body:**

```json
{
  "username": "exampleUser",
  "password": "examplePassword"
}
```

**Responses:**

- `200 OK` - Login successful, returns a JWT token
- `401 Unauthorized` - Invalid credentials
- `500 Internal Server Error` - Server error

---

### Gadgets

#### 3. Create a New Gadget

**Endpoint:** `POST /gadgets`

**Headers:**

```
Authorization: Bearer <your_token>
```

**Responses:**

- `201 Created` - Gadget created successfully
- `401 Unauthorized` - Authentication required
- `500 Internal Server Error` - Server error

#### 4. Get All Gadgets

**Endpoint:** `GET /gadgets`

**Headers:**

```
Authorization: Bearer <your_token>
```

**Query Parameters (Optional):**

- `status` - Filter gadgets by status (`Available`, `Deployed`, `Decommissioned`, `Destroyed`)

**Responses:**

- `200 OK` - List of gadgets retrieved
- `401 Unauthorized` - Authentication required
- `500 Internal Server Error` - Server error

#### 5. Update Gadget Status

**Endpoint:** `PATCH /gadgets/{id}`

**Headers:**

```
Authorization: Bearer <your_token>
```

**Request Body:**

```json
{
  "status": "Available"  // Options: Available, Deployed
}
```

**Responses:**

- `200 OK` - Gadget status updated successfully
- `400 Bad Request` - Invalid status
- `401 Unauthorized` - Authentication required
- `404 Not Found` - Gadget not found
- `500 Internal Server Error` - Server error

#### 6. Decommission a Gadget

**Endpoint:** `DELETE /gadgets/{id}`

**Headers:**

```
Authorization: Bearer <your_token>
```

**Responses:**

- `200 OK` - Gadget decommissioned successfully
- `401 Unauthorized` - Authentication required
- `404 Not Found` - Gadget not found
- `500 Internal Server Error` - Server error

#### 7. Self-Destruct a Gadget

**Endpoint:** `POST /gadgets/{id}/self-destruct`

**Headers:**

```
Authorization: Bearer <your_token>
```

**Request Body:**

```json
{
  "confirmationCode": "123456"
}
```

**Responses:**

- `200 OK` - Self-destruct sequence completed successfully
- `400 Bad Request` - Invalid confirmation code
- `401 Unauthorized` - Authentication required
- `404 Not Found` - Gadget not found
- `500 Internal Server Error` - Server error

## Gadget Object Structure

```json
{
  "id": 1,
  "name": "Smartwatch",
  "description": "A high-tech smartwatch with AI integration",
  "status": "Available"
}
```

## Security

- Uses **JWT Authentication** for secure API access.
- Ensures only authorized users can create, update, or delete gadgets.

## License

This API is licensed under the MIT License.

---

**For any issues or improvements, feel free to contribute!**


