const express = require('express');
const router = express.Router({ mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const Review = require('../models/review');
const review = require('../controllers/review');
const { validateReviews, isLoggedIn, isAuthor, isReviewAuthor } = require('../middleware');


const { reviewSchema } = require('../schemas.js');



router.post('/', isLoggedIn, validateReviews, catchAsync(review.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor,  catchAsync(review.deleteReview));

module.exports = router;