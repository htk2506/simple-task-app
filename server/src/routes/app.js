/**
 * Configuration for the Express server app.
 */

// Import modules
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const helmet = require('helmet');
const pgSession = require('connect-pg-simple')(session);

const db = require('../utils/db');
const auth = require('../utils/auth');
const tasksRouter = require('./tasks-router');
const authRouter = require('./auth-router');

// Create the app
const app = express();

// Middleware for whole app
app.use(cors({
    origin: /.*/,
    credentials: true
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.enable('trust proxy');
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 86400000 * 7,
        domain: process.env.DOMAIN,
        sameSite: process.env.NODE_ENV === 'production' ? 'lax' : undefined,
        secure: process.env.NODE_ENV === 'production' ? true : undefined,
        httpOnly: true
    },
    store: new pgSession({
        pool: db.pool,
        createTableIfMissing: true
    })
}));

// Passport configuration
app.use(passport.initialize());
app.use(passport.authenticate('session'));
auth.configurePassport(passport);

// Add the routes
app.use(tasksRouter);
app.use(authRouter);

module.exports = app;