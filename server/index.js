/**
 * Main entry point for setting up the Express server.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const db = require('./db');

// Create the app
const app = express();

// Middleware for whole app
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.get('/', async (req, res) => {
    // Test database query
    const result = await db.poolQuery('SELECT * FROM tasks');
    console.log(result.rows);
    // Response to client
    const msg = 'Hello World';
    res.send(msg);
});

// Start the server
const serverPort = process.env.SERVER_PORT || 5000;
app.listen(serverPort, () => {
    console.log(`Server started on port ${serverPort}`)
});