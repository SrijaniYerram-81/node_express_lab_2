# Lab 2: SQLite Database and CRUD Routes

## Student Details

| Field | Details |
|---|---|
| Student Name | srijani yerram |
| Registration Number | 252U1R1232 |
| College | Aurora University |
| Course | B.Tech |
| Department | Computer Science and Engineering (CSE)-2E |
| Academic Year | Year II |
| Term | Term II |
| Section | CSE 2-E|
| Subject | Backend Development Fundamentals |
| Faculty Name | Joel Prashanth D |
| Lab Number | Lab 2 |
| Lab Title | SQLite Database and CRUD Routes |

---

## 1. Project Overview

The objective of this lab is to develop a backend application using **Node.js, Express.js, and SQLite**. The application performs CRUD (Create, Read, Update, and Delete) operations on a Book database.

The application stores book information, including book ID, title, author, price, and number of pages. It provides REST API endpoints that allow users to retrieve, add, update, and delete book records.

SQLite is used as the database to store book information, while Express.js handles HTTP requests and responses.

## 2. Technologies Used

- Node.js – JavaScript runtime environment.
- Express.js – Backend web framework.
- SQLite – Relational database.
- sqlite3 – SQLite database driver.
- sqlite – Promise-based SQLite library.
- Nodemon – Automatically restarts the server during development.
- Postman – API testing tool.
- Visual Studio Code – Code editor.
- Git and GitHub – Version control and repository hosting.

## 3. Project Structure

```text
Lab2/
│
├── database/
│
├── screenshots/
│   ├── get-all-books.png
│   ├── get-book-by-id.png
│   ├── post-book.png
│   ├── put-book.png
│   └── delete-book.png
│
├── server.js
├── bookstore.db
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

**Note:** The database file location may differ depending on the path configured in `server.js`. The `node_modules` folder is not included in the GitHub repository.

## 4. Installation and Setup

### Step 1: Initialize the Node.js Project

Create a project folder and open it in Visual Studio Code.

Run the following command in the terminal:

```bash
npm init -y
```

### Step 2: Install Dependencies

Install Express, SQLite, and SQLite3:

```bash
npm install express sqlite sqlite3
```

Install Nodemon as a development dependency:

```bash
npm install --save-dev nodemon
```

### Step 3: Configure package.json

Add the following scripts inside the `scripts` section of `package.json`:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

### Step 4: Start the Server

Run the application using:

```bash
npm run dev
```

The server starts on:

```text
http://localhost:3000
```

## 5. Database Design

The application uses an SQLite database named `bookstore.db`.

The database contains a table named `book`.

### Table: book

| Column Name | Data Type | Description |
|---|---|---|
| id | INTEGER | Primary key and unique book ID |
| title | TEXT | Name of the book |
| author | TEXT | Author of the book |
| price | INTEGER | Price of the book |
| pages | INTEGER | Number of pages |

### SQL Table Creation

```sql
CREATE TABLE IF NOT EXISTS book (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    author TEXT,
    price INTEGER,
    pages INTEGER
);
```

### Sample Data

The database contains sample book records for testing the API endpoints.

Example:

```sql
INSERT INTO book (title, author, price, pages)
VALUES
('The Alchemist', 'Paulo Coelho', 350, 208),
('Atomic Habits', 'James Clear', 450, 320),
('Rich Dad Poor Dad', 'Robert Kiyosaki', 399, 336),
('Wings of Fire', 'A.P.J. Abdul Kalam', 300, 180),
('The Power of Habit', 'Charles Duhigg', 420, 371);
```

## 6. API Endpoints

The application provides five REST API endpoints to perform CRUD operations.

### 6.1 GET – Retrieve All Books

**Endpoint:**

```http
GET /books/
```

**Full URL:**

```text
http://localhost:3000/books/
```

**Description:**

This endpoint retrieves all book records available in the SQLite database.

**Expected Response:**

- Status Code: `200 OK`
- Returns a list of books in JSON format.

### 6.2 GET – Retrieve a Book by ID

**Endpoint:**

```http
GET /books/:bookId/
```

**Example URL:**

```text
http://localhost:3000/books/1/
```

**Description:**

This endpoint retrieves the details of a particular book using its unique ID.

**Expected Response:**

- Status Code: `200 OK` if the book exists.
- Status Code: `404 Not Found` if the book does not exist.

### 6.3 POST – Add a New Book

**Endpoint:**

```http
POST /books/
```

**Full URL:**

```text
http://localhost:3000/books/
```

**Description:**

This endpoint inserts a new book record into the SQLite database.

**Postman Configuration:**

1. Select the POST method.
2. Enter the endpoint URL.
3. Select Body.
4. Choose raw.
5. Select JSON.
6. Enter the following JSON data.

**Request Body:**

```json
{
  "title": "The Alchemist",
  "author": "Paulo Coelho",
  "price": 350,
  "pages": 208
}
```

**Expected Response:**

- Status Code: `201 Created`
- A new book record is inserted into the database.

### 6.4 PUT – Update an Existing Book

**Endpoint:**

```http
PUT /books/:bookId/
```

**Example URL:**

```text
http://localhost:3000/books/1/
```

**Description:**

This endpoint updates the details of an existing book using its ID.

**Request Body:**

```json
{
  "title": "Updated Book Title",
  "author": "Updated Author",
  "price": 500,
  "pages": 250
}
```

**Expected Response:**

- Status Code: `200 OK` if the book is updated successfully.
- Status Code: `404 Not Found` if the book does not exist.

### 6.5 DELETE – Delete a Book

**Endpoint:**

```http
DELETE /books/:bookId/
```

**Example URL:**

```text
http://localhost:3000/books/1/
```

**Description:**

This endpoint deletes a particular book record from the database using its ID.

**Expected Response:**

- Status Code: `200 OK` if the book is deleted successfully.
- Status Code: `404 Not Found` if the book does not exist.

## 7. API Testing Using Postman

Postman is used to test all five REST API endpoints.

The following test cases are performed:

| Test Case | HTTP Method | Endpoint | Expected Status |
|---|---|---|---|
| Retrieve all books | GET | `/books/` | 200 |
| Retrieve book by ID | GET | `/books/1/` | 200 |
| Add a new book | POST | `/books/` | 201 |
| Update a book | PUT | `/books/1/` | 200 |
| Delete a book | DELETE | `/books/1/` | 200 |

All endpoints are tested using Postman to verify that the application performs the required database operations correctly.

## 8. SQL Parameterized Queries

Parameterized SQL queries are used in the application to safely handle user input.

The `?` placeholder is used in SQL statements instead of directly inserting user-provided values into queries.

Examples:

```javascript
db.get(
    'SELECT * FROM book WHERE id = ?',
    [bookId]
);
```

```javascript
db.run(
    'DELETE FROM book WHERE id = ?',
    [bookId]
);
```

Parameterized queries help prevent SQL injection and make database operations safer.

## 9. Error Handling

The application handles common errors during API requests.

- Returns `404 Not Found` when a requested book does not exist.
- Validates the input data before inserting or updating records.
- Returns appropriate HTTP status codes.
- Uses asynchronous database operations.
- Handles database connection and server initialization errors.

## 10. Deployment

The application can be deployed using cloud platforms such as Render or Railway.

### Deployment Steps

1. Push the project code to GitHub.
2. Open the cloud deployment platform.
3. Connect the GitHub repository.
4. Configure the build command:

```bash
npm install
```

5. Configure the start command:

```bash
npm start
```

6. Deploy the application.
7. Test the deployed API endpoints.

**Deployment Status:** Add your deployment URL here if successfully deployed.

If deployment is not completed, mention the reason and include local Postman testing screenshots as evidence of working API endpoints.

**Note:** SQLite database files stored on temporary cloud filesystems may not persist across redeployments or restarts. Persistent storage or a hosted database may be required for reliable production deployment.

## 11. Learning Outcomes

After completing this lab, I learned:

1. How to initialize and configure a Node.js project.
2. How to install and use Express.js.
3. How to connect a Node.js application with an SQLite database.
4. How to create database tables and insert records.
5. How to perform CRUD operations using REST API endpoints.
6. How to use GET, POST, PUT, and DELETE HTTP methods.
7. How to use parameterized SQL queries.
8. How to handle errors and return appropriate HTTP status codes.
9. How to test APIs using Postman.
10. How to organize and manage a backend project using Git and GitHub.

## 12. Conclusion

This lab helped me understand how backend applications interact with databases using Node.js, Express.js, and SQLite. I successfully learned the implementation of CRUD operations through REST API endpoints.

By testing the endpoints using Postman, I understood how HTTP methods communicate with the backend and how database records are created, retrieved, updated, and deleted.

Overall, this lab improved my practical knowledge of backend development, database connectivity, API development, and testing.
