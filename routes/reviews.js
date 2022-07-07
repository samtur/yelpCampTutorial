const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const Campground = require('../models/campgrounds');
const Review = require('../models/review')
const { validateReview, isLoggedIn } = require('../middleware')

// Review post route.
router.post('/', isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'You successfully created a review!')
    res.redirect(`/campgrounds/${campground._id}`);
}))

// Review delete route.
router.delete('/:reviewId', wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'You successfully deleted a review!')
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;