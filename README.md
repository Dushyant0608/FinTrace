<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=32&pause=1000&color=00D9FF&center=true&vCenter=true&width=700&lines=FinTrace+API;Tamper-Proof+%26+ACID-Guaranteed;Idempotent+Financial+Ledger" alt="Typing SVG" />

<br/>

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Redis](https://img.shields.io/badge/Upstash_Redis-1DB954?style=for-the-badge&logo=redis&logoColor=white)](https://upstash.com)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io)
[![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://swagger.io)
[![Render](https://img.shields.io/badge/Deployed_on_Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://render.com)

<br/>

[![Live API](https://img.shields.io/badge/🚀_Live_API-fintrace--4ltx.onrender.com-blue?style=for-the-badge)](https://fintrace-4ltx.onrender.com)
[![Swagger Docs](https://img.shields.io/badge/📖_API_Docs-Swagger_UI-85EA2D?style=for-the-badge)](https://fintrace-4ltx.onrender.com/api-docs)

</div>

---

## 📌 Overview

**FinTrace** is an audit-grade double-entry financial ledger API built with Node.js. Every fund transfer produces permanent, unalterable DEBIT/CREDIT entry pairs enforced by 8 Mongoose pre-hooks that block all mutation operations — balances are derived from ledger aggregation, never stored directly. Transfers run through a 10-step ACID pipeline backed by MongoDB sessions with automatic rollback on failure.

```
Client → Express API → Routes → Controllers → Services → MongoDB
```

---

## ✨ Features

| Feature | Description |
|---|---|
| 📒 **Immutable Double-Entry Ledger** | 8 Mongoose pre-hooks block all mutations; every transfer produces permanent DEBIT/CREDIT pairs |
| ⚙️ **ACID Transaction Pipeline** | 10-step transfer flow with MongoDB sessions and automatic rollback on failure |
| 🔑 **Idempotency Keys** | Handles all four terminal states (COMPLETED/PENDING/FAILED/REVERSED) — no blind retry rejection |
| 🚦 **Layered Rate Limiting** | Two independent Upstash Redis limiters: IP-keyed on auth routes, user-keyed on transaction routes |
| 🔐 **JWT Auth + Token Blacklisting** | HTTP-only session cookies, bcrypt hashing, immediate session invalidation on logout |
| 📧 **Email Notifications** | OAuth2 Gmail notifications for registrations and transactions |
| 📄 **Swagger Docs** | Interactive API documentation at `/api-docs` |

---

## 🛠️ Tech Stack

**Runtime & Framework**
- Node.js + Express.js v5

**Database**
- MongoDB + Mongoose (ACID transactions)

**Security & Auth**
- JWT (jsonwebtoken)
- bcrypt password hashing

**Rate Limiting**
- Upstash Redis + `@upstash/ratelimit`

**Email**
- Nodemailer with Gmail OAuth2

**Documentation**
- Swagger UI + swagger-jsdoc

**Deployment**
- Render

---

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/Dushyant0608/FinTrace
cd FinTrace
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

# Upstash Redis
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

# Gmail OAuth2 (Nodemailer)
EMAIL_USER=your_gmail_address
CLIENT_ID=your_google_oauth_client_id
CLIENT_SECRET=your_google_oauth_client_secret
REFRESH_TOKEN=your_google_oauth_refresh_token
```

### 4. Start the server

```bash
# Development (with nodemon)
npm run dev

# Production
npm start
```

### 5. Open API Docs

```
http://localhost:3000/api-docs
```

---

## 📡 API Endpoints

### 🔐 Auth — `/api/auth`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/auth/register` | Register a new user | ❌ |
| `POST` | `/auth/login` | Login and receive JWT | ❌ |
| `POST` | `/auth/logout` | Logout and blacklist token | ✅ |

### 🏦 Account — `/api/account`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/account` | Create a new bank account | ✅ |
| `GET` | `/account` | Get all user accounts | ✅ |
| `GET` | `/account/balance/:accountId` | Get balance of an account | ✅ |

### 💸 Transaction — `/api/transaction`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/transaction` | Transfer funds between accounts | ✅ |
| `POST` | `/transaction/system/initial-fund` | Add initial system funds | System |

> **Full interactive documentation** available at [https://fintrace-4ltx.onrender.com/api-docs](https://fintrace-4ltx.onrender.com/api-docs)

---

## 📋 Example Requests

**Register**
```json
POST /api/auth/register
{
  "name": "Dushyant",
  "email": "dushyant@email.com",
  "password": "strongpassword123"
}
```

**Login**
```json
POST /api/auth/login
{
  "email": "dushyant@email.com",
  "password": "strongpassword123"
}
```

**Transfer Funds**
```json
POST /api/transaction
Authorization: Bearer <token>
{
  "fromAccount": "665f1a8e2a2f8d3f1c0a",
  "toAccount":   "665f1a8e2a2f8d3f1c0b",
  "amount": 500
}
```

---

## 🗂️ Project Structure

```
FinTrace/
│
├── src/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   ├── swagger.js         # Swagger config
│   │   └── upStash.js         # Upstash Redis client
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── account.controller.js
│   │   └── transaction.controller.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── auth.Ratelimiter.js
│   │   └── transaction.Ratelimiter.js
│   │
│   ├── models/
│   │   ├── user.model.js
│   │   ├── account.model.js
│   │   ├── transaction.model.js
│   │   ├── ledger.model.js
│   │   └── blackList.model.js
│   │
│   ├── routes/
│   │   ├── auth.route.js
│   │   ├── account.route.js
│   │   └── transaction.route.js
│   │
│   ├── services/
│   │   └── email.service.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env                       # Environment variables (not committed)
├── .gitignore
└── package.json
```

---

## 🌐 Live Deployment

| Resource | URL |
|---|---|
| Base API | https://fintrace-4ltx.onrender.com |
| Swagger Docs | https://fintrace-4ltx.onrender.com/api-docs |

---

## 👤 Author

<div align="center">

**Dushyant Yadav**
B.Tech CSE (AI & Data Science)

[![GitHub](https://img.shields.io/badge/GitHub-Dushyant0608-181717?style=for-the-badge&logo=github)](https://github.com/Dushyant0608)

</div>

---

<div align="center">

Made with ❤️ by Dushyant Yadav

</div>
