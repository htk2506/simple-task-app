/**
 * Configures Passport for authentication.
 */

// Import modules
require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oidc')
const db = require('../utils/db');

// Configure the Google authentication strategy
const googleStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
    callbackURL: '/oauth2/redirect/google',
    scope: ['profile'],
}, function verify(issuer, profile, cb) {
    // Query database for the user
    db.poolQuery('SELECT user_id,name FROM users WHERE google_id=$1', [profile.id])
        .then(queryResult => {
            const user = queryResult.rows[0];

            if (!user) {
                // No user info so attempt to add new user to database
                return db.poolQuery('INSERT INTO users (name,google_id) VALUES ($1,$2) RETURNING user_id,name', [profile.displayName, profile.id]);
            } else {
                // Return the query result and have it be handled by next in chain
                return queryResult;
            }
        })
        .then(queryResult => {
            const user = queryResult.rows[0];

            if (!user) {
                // No user
                return cb(null, false)

            } else {
                // Return user
                return cb(null, user);
            }
        })
        .catch(err => {
            // Handle errors
            console.error(err);
            return cb(err);
        })
});
passport.use(googleStrategy);

// Serialize the user as the id
passport.serializeUser((user, cb) => {
    cb(null, user.user_id);
});

// Deserialize the user as info from database
passport.deserializeUser((userId, cb) => {
    db.poolQuery('SELECT user_id,name FROM users WHERE user_id=$1', [userId])
        .then(queryResult => {
            const user = queryResult.rows[0];
            cb(null, user);
        })
        .catch(err => {
            console.error(err);
            cb(err);
        });
});

/**
 * Middleware that checks authentication and sends an error if user is not authenticated.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const checkAuth = async (req, res, next) => {
    try {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.status(401);
            res.send('You are not authenticated');
        }
    } catch (err) {
        console.error(err);
        res.status(500);
        res.send(err.message);
    }
}

module.exports = {
    checkAuth
}