const express = require('express');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

let db;

// Sample Books
const sampleBooks = [
    ['Harry Potter', 'J.K. Rowling', 500, 350],
    ['The Alchemist', 'Paulo Coelho', 300, 208],
    ['Wings of Fire', 'A.P.J. Abdul Kalam', 250, 180],
    ['Atomic Habits', 'James Clear', 450, 320],
    ['Rich Dad Poor Dad', 'Robert Kiyosaki', 350, 250],
    ['The Great Gatsby', 'F. Scott Fitzgerald', 200, 180],
    ['Think and Grow Rich', 'Napoleon Hill', 400, 280],
    ['Ikigai', 'Hector Garcia', 320, 190],
    ['The Power of Habit', 'Charles Duhigg', 380, 290],
    ['Deep Work', 'Cal Newport', 420, 300]
];

// Initialize Database and Server
const initializeDBAndServer = async () => {
    try {
        db = await open({
            filename: path.join(__dirname, 'bookstore.db'),
            driver: sqlite3.Database
        });

        console.log('Database connected successfully');

        // Create Books Table
        await db.exec(`
            CREATE TABLE IF NOT EXISTS book (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                author TEXT NOT NULL,
                price INTEGER NOT NULL,
                pages INTEGER NOT NULL
            );
        `);

        // Insert sample books only if table is empty
        const count = await db.get(
            'SELECT COUNT(*) AS count FROM book'
        );

        if (count.count === 0) {
            for (const book of sampleBooks) {
                await db.run(
                    `INSERT INTO book (title, author, price, pages)
                     VALUES (?, ?, ?, ?)`,
                    book
                );
            }
            console.log('10 sample books inserted');
        }

        // Start Server after database connection
        app.listen(PORT, () => {
            console.log(`Server running at port ${PORT}`);
        });

    } catch (error) {
        console.log(`Database Error: ${error.message}`);
        process.exit(1);
    }
};

// Home Route
app.get('/', (request, response) => {
    response.status(200).send('Welcome to Book Store API');
});

// 1. GET All Books
app.get('/books/', async (request, response) => {
    try {
        const books = await db.all(
            'SELECT * FROM book ORDER BY id'
        );

        response.status(200).send(books);

    } catch (error) {
        response.status(500).send({ error: error.message });
    }
});

// 2. GET Book by ID
app.get('/books/:bookId/', async (request, response) => {
    try {
        const { bookId } = request.params;

        const book = await db.get(
            'SELECT * FROM book WHERE id = ?',
            [bookId]
        );

        if (!book) {
            return response.status(404).send({
                error: 'Book not found'
            });
        }

        response.status(200).send(book);

    } catch (error) {
        response.status(500).send({ error: error.message });
    }
});

// 3. POST - Add New Book
app.post('/books/', async (request, response) => {
    try {
        const { title, author, price, pages } = request.body;

        if (
            typeof title !== 'string' || !title.trim() ||
            typeof author !== 'string' || !author.trim() ||
            !Number.isInteger(price) || price < 0 ||
            !Number.isInteger(pages) || pages <= 0
        ) {
            return response.status(400).send({
                error: 'Please provide valid title, author, price and pages'
            });
        }

        const result = await db.run(
            `INSERT INTO book (title, author, price, pages)
             VALUES (?, ?, ?, ?)`,
            [title.trim(), author.trim(), price, pages]
        );

        response.status(201).send({
            message: 'Book Added Successfully',
            bookId: result.lastID
        });

    } catch (error) {
        response.status(500).send({ error: error.message });
    }
});

// 4. PUT - Update Book
app.put('/books/:bookId/', async (request, response) => {
    try {
        const { bookId } = request.params;
        const { title, author, price, pages } = request.body;

        if (
            typeof title !== 'string' || !title.trim() ||
            typeof author !== 'string' || !author.trim() ||
            !Number.isInteger(price) || price < 0 ||
            !Number.isInteger(pages) || pages <= 0
        ) {
            return response.status(400).send({
                error: 'Please provide valid title, author, price and pages'
            });
        }

        const result = await db.run(
            `UPDATE book
             SET title = ?, author = ?, price = ?, pages = ?
             WHERE id = ?`,
            [title.trim(), author.trim(), price, pages, bookId]
        );

        if (result.changes === 0) {
            return response.status(404).send({
                error: 'Book not found'
            });
        }

        response.status(200).send({
            message: 'Book Updated Successfully'
        });

    } catch (error) {
        response.status(500).send({ error: error.message });
    }
});

// 5. DELETE - Remove Book
app.delete('/books/:bookId/', async (request, response) => {
    try {
        const { bookId } = request.params;

        const result = await db.run(
            'DELETE FROM book WHERE id = ?',
            [bookId]
        );

        if (result.changes === 0) {
            return response.status(404).send({
                error: 'Book not found'
            });
        }

        response.status(200).send({
            message: 'Book Deleted Successfully'
        });

    } catch (error) {
        response.status(500).send({ error: error.message });
    }
});

// Handle Unknown Routes
app.use((request, response) => {
    response.status(404).send({
        error: 'Route Not Found'
    });
});

initializeDBAndServer();
