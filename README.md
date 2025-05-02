
# 🕵️ IMF Gadget Inventory API

## Overview

The **IMF Gadget Inventory API** is a secure, production-ready RESTful API built to simulate real-world gadget tracking and lifecycle management for intelligence missions. It supports agent authentication, gadget registration, codename generation, soft deletion, and a self-destruct mechanism using confirmation codes.

🔗 **Live Demo**: [https://imfgadgetapi.onrender.com](https://imfgadgetapi.onrender.com)

---

## 🚀 Features

- ✅ JWT-based authentication and route protection  
- 🧑‍💻 Secure user registration and login endpoints  
- 🛰️ Gadget creation with auto-generated code names  
- 🔄 Status-based gadget filtering and updates (`Available`, `Deployed`, etc.)  
- 🗃️ Soft deletion for decommissioned gadgets  
- 💣 Self-destruct sequence with randomized confirmation codes  
- 📜 Swagger-based API documentation  
- ☁️ Deployed on Render for scalability and uptime

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js  
- **Database:** PostgreSQL  
- **Authentication:** JWT  
- **Documentation:** Swagger  
- **Hosting:** Render

---

## 🔐 Authentication

The API uses Bearer Token Authentication via JWT.

Include the token in your `Authorization` header:

```http
Authorization: Bearer <your_token>
```

---

## 📦 API Endpoints

### 🔑 Auth Routes

#### 1. Register

`POST /auth/register`

```json
{
  "username": "exampleUser",
  "password": "examplePassword"
}
```

#### 2. Login

`POST /auth/login`

```json
{
  "username": "exampleUser",
  "password": "examplePassword"
}
```

> 🔁 Returns a JWT token upon successful login.

---

### 🧰 Gadget Routes

#### 3. Create Gadget

`POST /gadgets`  
_(Requires JWT Token)_

#### 4. Get All Gadgets

`GET /gadgets`  
_(Optional filter: `status=Available|Deployed|Decommissioned|Destroyed`)_

#### 5. Update Gadget Status

`PATCH /gadgets/{id}`

```json
{
  "status": "Available"
}
```

#### 6. Decommission Gadget

`DELETE /gadgets/{id}`  
_(Soft delete)_

#### 7. Self-Destruct Gadget

`POST /gadgets/{id}/self-destruct`

```json
{
  "confirmationCode": "123456"
}
```

---

## 🧱 Gadget Schema

```json
{
  "id": 1,
  "name": "Smartwatch",
  "description": "A high-tech smartwatch with AI integration",
  "status": "Available"
}
```

---

## 🧪 Test Credentials (Optional)

If you'd like to offer test credentials, add a section like:

```md
### 🧪 Test Credentials
Username: agent007@imf.com  
Password: secret007
```

---

## 📜 License

MIT License

---

## 🤝 Contributing

Contributions, suggestions, and PRs are welcome!
