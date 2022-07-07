// REQUIREMENTS
const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const Campground = require('../models/campgrounds');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')


// ROUTES
router.get('/', wrapAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})

router.post('/', isLoggedIn, validateCampground, wrapAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}));

router.get('/:id', wrapAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate('reviews').populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground });
}));

router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground });
}));

router.put('/:id', isLoggedIn, isAuthor, validateCampground, wrapAsync(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:id', isLoggedIn, isAuthor, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'You successfully deleted a campground!')
    res.redirect('/campgrounds');
}));


// EXECUTING ROUTER
module.exports = router;