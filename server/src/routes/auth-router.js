/**
 * Router for authentication.
 */

// Import modules
require('dotenv').config();
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oidc')
const db = require('../utils/db');

// Configure Passport
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
// Create the router
const router = express.Router();

// Initiate login with Google authentication
router.route('/login/google')
    .get(async (req, res, next) => {
        // Get the client's URL to redirect back to
        const requestOrigin = req.get('host') || req.get('origin');
        const redirectTo = requestOrigin ? `http://${requestOrigin}` : '/';

        // Use the authenticator and pass the redirection URL
        const authenticator = passport.authenticate('google', { state: { redirectTo } });
        authenticator(req, res, next);
    });

// Redirect route used by Google authentication
router.route('/oauth2/redirect/google')
    .get(passport.authenticate('google', {
        failureRedirect: '/login/failure'
    }))
    .get(async (req, res) => {
        try {
            // Redirect back to client
            redirectTo = req.authInfo.state.redirectTo || '/';
            res.redirect(redirectTo);
        } catch (err) {
            console.error(err)
            res.status(500);
            res.send(err.message);
        }
    });

// Get user's info 
router.route('/login/user-info')
    .get(async (req, res) => {
        try {
            if (req.isAuthenticated()) {
                res.status(200);
                res.json(req.user);
            } else {
                res.status(401);
                res.send('You are not authenticated');
            }
        }
        catch (err) {
            console.error(err);
            res.status(500);
            res.send(err.message);
        }
    });

// Logout route
router.route('/logout')
    .get(async (req, res, next) => {
        req.logout(err => {
            if (err) {
                console.error(err);
                return next(err);
            }

            // Redirect back to client
            const requestOrigin = req.get('host') || req.get('origin');
            const redirectTo = requestOrigin ? `http://${requestOrigin}` : '/';
            res.redirect(redirectTo);
        });
    });

// Login failure
router.route('/login/failure')
    .get(async (req, res) => {
        try {
            res.status(401);
            res.send('You are not authenticated');
        } catch (err) {
            console.error(err);
            res.status(500);
            res.send(err.message);
        }
    });
//#endregion

// Export the router
module.exports = router;