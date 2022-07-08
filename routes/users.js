// REQUIREMENTS
const express = require('express');
const router = express.Router();
const users = require('../controllers/users')
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');

//ROUTES
router.route('/register')
    .get(users.renderRegister)
    .post(wrapAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.loginUser);

router.get('/logout', users.logout);

// EXECUTING ROUTER
module.exports = router;
