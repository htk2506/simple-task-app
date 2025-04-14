/**
 * Main entry point for setting up the Express server.
 */

// Import modules
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const helmet = require('helmet');
const pgSession = require('connect-pg-simple')(session);

const db = require('./utils/db');
const auth = require('./utils/auth');
const tasksRouter = require('./routes/tasks-router');
const authRouter = require('./routes/auth-router');

console.log(`NODE_ENV: ${process.env.NODE_ENV}`)

// Create the app
const app = express();

// Middleware for whole app
app.use(cors({
    origin: /.*/,
    // origin: ['https://simple-task-app-server.fly.dev', 'https://simple-task-app-client.fly.dev', 'http://localhost:5000', 'http://localhost:3000'],
    credentials: true
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'production') {
    console.log('Production setup');
    app.enable('trust proxy');
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 86400000 * 3, // 7 days
            sameSite: "None",
            secure: true,
            partitioned: true,
            // httpOnly: true,
        },
        store: new pgSession({
            pool: db.pool,
            createTableIfMissing: true
        })
    }));
} else {
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 86400000 * 3, // 7 days
            httpOnly: false
        },
        store: new pgSession({
            pool: db.pool,
            createTableIfMissing: true
        })
    }));
}

app.use(passport.initialize());
app.use(passport.authenticate('session'));

// Add the routes
app.use(tasksRouter);
app.use(authRouter);

// Start the server
const serverPort = process.env.SERVER_PORT || 5000;
app.listen(serverPort, () => {
    console.log(`Server started on port ${serverPort}`)
});