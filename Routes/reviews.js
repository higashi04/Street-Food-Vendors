const express = require('express');
const router = express.Router({mergeParams: true});
const AsyncErrors = require('../AsyncErrors');
const reviewController = require('../controllers/reviews')
const {isLoggedIn, isReviewAuthor, validateReview} = require('../middleware');

router.post('/', isLoggedIn, validateReview, AsyncErrors(reviewController.postReview));
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, AsyncErrors(reviewController.deleteReview));

module.exports = router;