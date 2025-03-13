/**
 * Main entry point for setting up the Express server.
 */

// Import modules
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const tasksRouter = require('./routes/tasks-router');

// Create the app
const app = express();

// Middleware for whole app
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add the routes
app.use(tasksRouter);

// Start the server
const serverPort = process.env.SERVER_PORT || 3000;
app.listen(serverPort, () => {
    console.log(`Server started on port ${serverPort}`)
});