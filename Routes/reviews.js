const express = require('express');
const router = express.Router({mergeParams: true});
const AsyncErrors = require('../AsyncErrors');
const AppError = require('../AppError');
const { reviewSchema } = require('../validaTacos');
const Review = require('../models/reviews');
const Puestos = require('../models/puestos');

const validateReview = (req, res, next) =>{
    const {error} = reviewSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el => el.message).join(',')
        throw new AppError(msg, 400)
    } else {
        next();}
}

router.post('/', validateReview, AsyncErrors(async(req, res) =>{
    const puesto = await Puestos.findById(req.params.id);
    const review = new Review(req.body.review);
    puesto.reviews.push(review);
    await review.save();
    await puesto.save();
    req.flash('success', 'Reseña publicada correctamente');
    res.redirect(`/puestos/${puesto._id}`);
}));

router.delete('/:reviewId', AsyncErrors(async(req, res) =>{
    const {id, reviewId} = req.params;
    await Puestos.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Reseña eliminada correctamente');
    res.redirect(`/puestos/${id}`);
}));

module.exports = router;