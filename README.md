# Expense Tracker (Full-Stack)

A minimal full-stack expense tracking application built as part of a technical assessment.
The app allows users to record, view, filter, and analyze personal expenses with a focus on correctness, reliability, and production-like behavior.

---

## 🚀 Features

* Add new expenses (amount, category, description, date)
* View list of expenses
* Filter expenses by category
* Sort expenses by date (newest first)
* View total of current filtered expenses
* Category-wise expense summary
* Persistent storage using JSON file
* Idempotent POST requests (prevents duplicates)
* Loading, error, and empty UI states
* Form validation (client + server)
* Safe money handling using integer paise

---

## 🧱 Tech Stack

### Frontend

* Next.js (App Router)
* React
* Tailwind CSS

### Backend

* Node.js
* Express.js

### Storage

* JSON file (simple file-based persistence)

---

## 📦 How to Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/Isaac-Johnn/Expense-Tracker.git
cd Expense-Tracker
```

---

### 2. Start Backend

```bash
cd backend
npm install
node server.js
```

Server runs on:
👉 http://localhost:3001

---

### 3. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs on:
👉 http://localhost:3000

---

## 🔌 API Endpoints

### POST /expenses

Create a new expense

**Body:**

```json
{
  "id": "uuid",
  "amount": 10000,
  "category": "food",
  "description": "Lunch",
  "date": "2026-04-29"
}
```

* `amount` is stored in **paise (integer)**

---

### GET /expenses

Supports optional query params:

* `category=food`
* `sort=date_desc`

---

## 🧠 Key Design Decisions

### 1. Money Handling (Important)

* Amount is stored as **integer paise**
* Avoids floating-point precision issues
* Displayed as INR using formatting on frontend

---

### 2. Idempotency

* Each expense uses a client-generated UUID
* Duplicate requests (retries, double-clicks) return existing record instead of creating duplicates

---

### 3. Persistence Choice

* JSON file used for simplicity and fast setup
* Suitable for small datasets and prototyping
* Avoids database setup overhead within time constraints

---

### 4. Client-side Filtering & Sorting

* Performed on frontend for simplicity
* Backend still supports filtering/sorting if needed
* Reduces API complexity

---

## ⚖️ Trade-offs

* No database (used JSON file instead)
* No concurrency control for file writes
* Limited validation (basic but sufficient)
* No authentication
* No pagination (not needed for small dataset)

---

## 🧪 Edge Cases Handled

* Duplicate submissions (idempotency)
* Empty inputs
* Invalid amounts
* Network/API failures
* Loading states
* Empty dataset state

---

## 🔮 Future Improvements

* Replace JSON storage with a database (PostgreSQL / MongoDB)
* Add pagination for large datasets
* Add authentication
* Add edit/delete functionality
* Improve UI/UX further
* Add automated tests

---

## 🌐 Deployment

Frontend can be deployed using:

* Vercel

🔌 Backend API:

Base URL:
* https://expense-tracker-6tss.onrender.com

Test endpoint:
* https://expense-tracker-6tss.onrender.com/expenses

---

## 📌 Summary

This project focuses on:

* correctness over feature bloat
* real-world behavior (retries, validation, errors)
* clean and maintainable code

---

## 📷 Commit History

(Attach screenshot of commit history here as required by assessment)

---
