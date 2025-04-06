/**
 * Router for authentication.
 */

// Import modules
require('dotenv').config();
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oidc')
const db = require('../utils/db');

// Create the router
const router = express.Router();

// Configure Passport
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
    callbackURL: '/oauth2/redirect/google',
    scope: ['profile']
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
}));

// Serialize the user as the id
passport.serializeUser((user, cb) => {
    cb(null, user.user_id);
});

// Deserialize the user
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

//#region routes
// Initiate login with Google authentication
router.route('/login/google')
    // GET route
    .get(passport.authenticate('google'));

// Redirect route used by Google authentication
router.route('/oauth2/redirect/google')
    .get(passport.authenticate('google', {
        successRedirect: '/login/me',
        failureRedirect: '/login/me'
    }));

router.route('/login/me')
    // GET test information
    .get(async (req, res) => {
        if (req.isAuthenticated()) {
            res.json(req.user);
        } else {
            res.send('You are not authenticated');
        }
    });

// Logout route
router.route('/logout')
    // GET route for logging out
    .get(async (req, res, next) => {
        req.logout(err => {
            if (err) {
                console.error(err);
                return next(err);
            }
            // TODO: redirect to origin 
            res.redirect('/login/me')
        });

    });
//#endregion

// Export the router
module.exports = router;