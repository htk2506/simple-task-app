/**
 * Router for authentication.
 */

// Import modules
require('dotenv').config();
const express = require('express');
const passport = require('passport');

// Create the router
const router = express.Router();

router.route('/login/google')
    // GET logged in with Google authentication
    .get(async (req, res, next) => {
        // Get the client's URL to redirect back to
        const requestOrigin = req.get('host') || req.get('origin');
        const redirectTo = requestOrigin ? `http://${requestOrigin}` : '/';

        // Use the authenticator and pass the redirection URL
        const authenticator = passport.authenticate('google', { state: { redirectTo } });
        authenticator(req, res, next);
    });

// Callback route used by Google authentication
router.route('/oauth2/redirect/google')
    // GET failures and successes properly redirected
    .get(
        passport.authenticate('google', {
            failureRedirect: '/user-info'
        }),
        async (req, res) => {
            try {
                // Redirect back to client
                redirectTo = req.authInfo.state.redirectTo || '/';
                res.redirect(redirectTo);
            } catch (err) {
                console.error(err)
                res.status(500);
                res.send(err.message);
            }
        }
    );

router.route('/user-info')
    // GET user's info 
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

router.route('/logout')
    // GET to logout 
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

// Export the router
module.exports = router;