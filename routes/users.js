// REQUIREMENTS
const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
// REGISTER ROUTES
router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', wrapAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err)
            req.flash('success', 'Welcome to Yelp Camp');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}));
// LOGIN ROUTES
router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect('/campgrounds');
})

router.get('/logout', (req, res, next) => {
    req.logout();
    req.flash('success', 'Successfully Logged Out!');
    res.redirect('/campgrounds');
});
// EXECUTING ROUTER
module.exports = router;
