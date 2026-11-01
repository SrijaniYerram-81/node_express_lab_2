const express = require('express');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const app = express();

app.use(express.json());

let db;

// GET all books
app.get('/books/', async (request, response) => {
    const books = await db.all('SELECT * FROM book');
    response.status(200).send(books);
});

// GET book by ID
app.get('/books/:bookId/', async (request, response) => {
    const { bookId } = request.params;

    const book = await db.get(
        'SELECT * FROM book WHERE id = ?',
        [bookId]
    );

    if (book === undefined) {
        response.status(404).send('Book not found');
    } else {
        response.status(200).send(book);
    }
});

// Database initialization
const initializeDBAndServer = async () => {
    try {
        db = await open({
            filename: './bookstore.db',
            driver: sqlite3.Database
        });

        console.log('Database connected successfully');

        app.listen(3000, () => {
            console.log('Server running at http://localhost:3000');
        });
    } catch (error) {
        console.log(`DB Error: ${error.message}`);
        process.exit(1);
    }
};

initializeDBAndServer();