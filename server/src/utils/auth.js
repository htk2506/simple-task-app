/**
 * Functions and middleware for Passport authentication.
 */

// Import modules
require('dotenv').config();
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
    db.getUserWithGoogleId(profile.id)
        .then(user => {
            if (!user) {
                // No user info so attempt to add new user to database
                return db.insertUserWithGoogleId(profile.displayName, profile.id);
            } else {
                // Return the query result and have it be handled by next in chain
                return user;
            }
        })
        .then(user => {
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

/**
 * Configure Passport.
 * @param {*} passport The Passport object.
 */
const configurePassport = (passport) => {

    passport.use('google', googleStrategy);

    // Serialize the user as the id
    passport.serializeUser((user, cb) => {
        return cb(null, user.user_id);
    });

    // Deserialize the user as info from database
    passport.deserializeUser((userId, cb) => {
        db.getUser(userId)
            .then(({ user_id, name }) => {
                return cb(null, { user_id, name });
            })
            .catch(err => {
                console.error(err);
                return cb(err);
            });
    });
}

/**
 * Middleware that checks authentication and sends an error if user is not authenticated.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const checkAuth = async (req, res, next) => {
    try {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.status(401);
            return res.send('You are not authenticated');
        }
    } catch (err) {
        console.error(err);
        res.status(500);
        return res.send(err.message);
    }
}

module.exports = {
    configurePassport,
    checkAuth
}