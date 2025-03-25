# masterSchool

`masterSchool` is a Node.js REST API for managing an admissions process. It allows you to create users, track their progress through a multi-step enrollment flow, and determine their acceptance status.

---

## 📋 Features

- **User Management** – Create and manage users with personal details  
- **Admissions Flow Tracking** – Track user progress through predefined steps and tasks  
- **Status Evaluation** – Automatically determine if a user is accepted, rejected, or still in progress

---

## 🚀 Getting Started

### ✅ Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or later)
- npm (comes with Node.js)

---

### 📦 Installation

```bash
git clone https://github.com/AhiyaSchneider/masterSchool
cd masterSchool
npm install
```

---

## 🖥️ Running the Server

```bash
node index.js
```

By default, the server will run on:  
`http://localhost:3000`

---

## 🧪 Testing the API (manually)

Run the test script to simulate API calls:

```bash
node test.js
```

This will:
- Create a user
- Complete an IQ Test step
- Check the user's current step and status

---

## 📚 API Endpoints

| Method | Endpoint                       | Description                       |
|--------|--------------------------------|-----------------------------------|
| POST   | `/api/users`                   | Create a new user                 |
| GET    | `/api/flow`                    | Get the full admissions flow      |
| GET    | `/api/users/:userId/step`      | Get current step for a user       |
| PUT    | `/api/steps/complete`          | Mark a step as complete           |
| GET    | `/api/users/:userId/status`    | Get a user's admission status     |

---

## 🗒️ Notes

- The app uses in-memory storage — data is reset on server restart.  
- Duplicate users with the same name + email are not allowed.  
- You can edit the flow dynamically inside `flowModel.js`.

---

## 🧠 Future Ideas

- Add database support (MongoDB or PostgreSQL)  
- Include a web-based frontend  
- Add email notifications on step completion

---

## 📄 License

MIT License
