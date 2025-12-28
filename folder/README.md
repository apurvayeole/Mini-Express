
---

## How a Request Flows (Very Important)

Every request follows this order:

1. A **new request object** is created
2. Middleware runs **one by one**
3. Data is added to `req` (body, cookies, user, etc.)
4. Route handler runs
5. If an error happens → error middleware runs
6. Response is sent
7. Request object is destroyed

Nothing is shared between requests.

---

## Steps I Followed While Building This

### Step 1 — Basic HTTP Server
- Used Node.js `http` module
- Learned how requests and responses work

### Step 2 — Routing
- Created my own routing system
- Mapped `METHOD + PATH` to handlers

### Step 3 — Middleware System
- Built `use()` and `next()`
- Learned why middleware order matters

### Step 4 — Error Handling
- Implemented `next(err)`
- Learned why servers crash when errors are unhandled

### Step 5 — JSON Body Parser
- Built my own `json()` middleware
- Understood how request streams work

### Step 6 — Refactoring Structure
- Split logic into different files
- Learned separation of concerns

### Step 7 — Authentication (Sessions)
- Implemented login using cookies + sessions
- Learned that identity is rebuilt on every request

### Step 8 — Route-Level Middleware
- Added support for `authRequired()` per route
- Learned how Express supports multiple handlers

### Step 9 — Request Scoped Context
- Learned that `req` is new for every request
- Understood why data doesn’t leak between users

### Step 10 — Logging & Request IDs
- Added unique request ID per request
- Learned how real servers debug issues

### Step 11 — Rate Limiting
- Protected server from abuse
- Learned why rate limiting is middleware

### Step 12 — API Polish
- Created `app.get()`, `app.post()`
- Made the framework easy to use

---

## Common Doubts I Had (And What I Learned)

### ❓ Why does middleware run before routes?
➡️ Because middleware prepares data and protects the server **before** business logic runs.

---

### ❓ Why was `req.body` undefined?
➡️ Because JSON middleware must run **before** the route.

---

### ❓ Why was `req.cookies` undefined?
➡️ Because cookies middleware must **initialize `req.cookies = {}`** even if empty.

---

### ❓ Why didn’t `req.user` exist everywhere?
➡️ Because `req.user` is added only by auth middleware.

---

### ❓ Why does the same user work across routes?
➡️ Data is NOT carried.  
Identity is **rebuilt on every request** using cookies.

---

### ❓ Why did the server crash during error handling?
➡️ Because my error handler itself threw an error.
Error handlers must never crash.

---

### ❓ Why does rate limiting belong in middleware?
➡️ Because it protects the **server**, not one route.

---

## What I Gained From This Project

- I understand Express internally
- Middleware no longer feels magical
- Debugging backend systems feels calmer
- I can design systems, not just use libraries

---

## Disclaimer

This project is for **learning purposes**.
Production systems use battle-tested libraries.

The goal was **understanding**, not replacement.

---

## How to Run

```bash
npm install
node server.js
