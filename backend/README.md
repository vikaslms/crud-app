# Node.js MySQL CRUD REST API with JWT Auth

A simple REST API built with **Express.js** and **MySQL** for full CRUD operations.

## 📁 Project Structure
```
nodejs-mysql-crud/
├── config/
│   └── db.js              # MySQL connection pool
├── controllers/
│   └── userController.js  # CRUD logic
├── routes/
│   └── userRoutes.js      # API routes
├── .env                   # Environment variables
├── db.sql                 # Database setup script
├── server.js              # Entry point
└── package.json
```

## 🚀 Setup & Run

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
Edit `.env` with your MySQL credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=crud_db
PORT=3000
```

### 3. Set up the database
Run `db.sql` in your MySQL client:
```bash
mysql -u root -p < db.sql
```

### 4. Start the server
```bash
npm start        # production
npm run dev      # development (with nodemon)
```

---

## 📡 API Endpoints

| Method | Endpoint          | Description       |
|--------|-------------------|-------------------|
| POST   | /api/users        | Create a user     |
| GET    | /api/users        | Get all users     |
| GET    | /api/users/:id    | Get user by ID    |
| PUT    | /api/users/:id    | Update a user     |
| DELETE | /api/users/:id    | Delete a user     |

---

## 🧪 Example Requests

### Create User
```http
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30
}
```

### Get All Users
```http
GET /api/users
```

### Get User by ID
```http
GET /api/users/1
```

### Update User
```http
PUT /api/users/1
Content-Type: application/json

{
  "name": "John Updated",
  "email": "john_updated@example.com",
  "age": 31
}
```

### Delete User
```http
DELETE /api/users/1
```
