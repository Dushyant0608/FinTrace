<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=32&pause=1000&color=00D9FF&center=true&vCenter=true&width=700&lines=FinTrace+API;Tamper-Proof+%26+ACID-Guaranteed;Idempotent+Financial+Ledger" alt="Typing SVG" />

<br/>

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://prisma.io)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io)
[![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://swagger.io)

</div>

---

## 📌 Overview

**FinTrace** is an audit-grade double-entry financial ledger API built with Node.js and PostgreSQL. Every fund transfer produces permanent, unalterable DEBIT/CREDIT entry pairs enforced by a **PostgreSQL trigger** that blocks all UPDATE and DELETE operations on ledger entries — balances are derived from ledger aggregation via raw SQL, never stored directly. Transfers run through a 10-step ACID pipeline inside a **Prisma interactive transaction** with `SELECT FOR UPDATE` row locking and automatic rollback on failure.

```
Client → Express API → Routes → Controllers → Prisma ORM → PostgreSQL
```

---

## ✨ Features

| Feature | Description |
|---|---|
| 📒 **Immutable Double-Entry Ledger** | PostgreSQL trigger blocks all UPDATE/DELETE on ledger entries; every transfer produces permanent DEBIT/CREDIT pairs |
| ⚙️ **ACID Transaction Pipeline** | 10-step transfer flow inside Prisma interactive transaction with automatic rollback on failure |
| 🔒 **Deadlock-Safe Row Locking** | `SELECT FOR UPDATE` with consistent UUID lock ordering prevents deadlocks in concurrent transfers |
| 💰 **Ledger-Derived Balances** | Balance calculated via raw SQL `SUM + CASE` query — never stored, always accurate |
| 🔑 **Idempotency Keys** | Handles all four terminal states (COMPLETED/PENDING/FAILED/REVERSED) — no blind retry rejection |
| 🚦 **Layered Rate Limiting** | Two independent Redis limiters via `rate-limiter-flexible`: IP-keyed on auth routes, user-keyed on transaction routes |
| 🔐 **JWT Auth + Token Blacklisting** | HTTP-only session cookies, bcrypt hashing, immediate session invalidation on logout with scheduled cleanup job |
| 📧 **Email Notifications** | SMTP Gmail notifications for registrations and transactions |
| 📄 **Swagger Docs** | Interactive API documentation at `/api-docs` |

---

## 🛠️ Tech Stack

**Runtime & Framework**
- Node.js + Express.js v5

**Database**
- PostgreSQL + Prisma ORM v7
- `@prisma/adapter-pg` for direct PostgreSQL connection
- Raw SQL via `prisma.$queryRaw` for balance calculation and row locking

**Cache & Rate Limiting**
- Redis (local / AWS ElastiCache on deployment)
- `ioredis` + `rate-limiter-flexible`

**Security & Auth**
- JWT (jsonwebtoken)
- bcrypt password hashing

**Email**
- Nodemailer with Gmail SMTP + App Password

**Documentation**
- Swagger UI + swagger-jsdoc

---

## 🚀 Quick Start

### Prerequisites
- Node.js
- PostgreSQL running locally
- Redis running locally

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
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/postgres
JWT_SECRET=your_jwt_secret_key

# Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# Gmail SMTP
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
```

### 4. Run database migrations

```bash
npx prisma migrate dev
```

### 5. Start the server

```bash
# Development
npm run dev

# Production
npm start
```

### 6. Open API Docs

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
| `GET` | `/account/balance/:accountId` | Get account balance | ✅ |

### 💸 Transaction — `/api/transaction`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/transaction` | Transfer funds between accounts | ✅ |
| `POST` | `/transaction/system/initial-fund` | Add initial system funds | System |

> **Full interactive documentation** available at `/api-docs`

---

## 🏗️ Architecture

### Transfer Pipeline (10 steps)
```
1. Validate request fields
2. Validate idempotency key → return existing result if found
3. Check both accounts are ACTIVE
4. SELECT FOR UPDATE with UUID lock ordering (deadlock prevention)
5. Derive sender balance via raw SQL SUM + CASE
6. Create transaction record (PENDING)
7. Create DEBIT ledger entry
8. Create CREDIT ledger entry
9. Mark transaction COMPLETED → commit
10. Send email notification
```

### Ledger Immutability
Enforced at the database level via a PostgreSQL trigger — not the application layer. No application code can accidentally mutate or delete ledger entries.

### Balance Calculation
```sql
SELECT
  COALESCE(SUM(CASE WHEN type = 'CREDITED' THEN amount ELSE 0 END), 0) -
  COALESCE(SUM(CASE WHEN type = 'DEBITED'  THEN amount ELSE 0 END), 0) AS balance
FROM ledger_entries
WHERE account_id = $accountId
```

---

## 🗂️ Project Structure

```
FinTrace/
│
├── prisma/
│   ├── schema.prisma          # Data models and enums
│   └── migrations/            # SQL migration files (incl. immutability trigger)
│
├── prisma.config.ts           # Prisma CLI datasource config (v7)
│
├── src/
│   ├── config/
│   │   ├── db.js              # Prisma client with pg adapter
│   │   ├── redis.js           # ioredis client + rate limiters
│   │   └── swagger.js         # Swagger config
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
├── .env
├── .gitignore
└── package.json
```

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