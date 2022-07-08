const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const reviews = require('../controllers/reviews');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')

// Review post route.
router.post('/', isLoggedIn, validateReview, wrapAsync(reviews.createReview))

// Review delete route.
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(reviews.deleteReview))

module.exports = router;