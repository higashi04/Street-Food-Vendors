const Review = require('../models/reviews');
const Puestos = require('../models/puestos');

module.exports.postReview = async(req, res) =>{
    const puesto = await Puestos.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    puesto.reviews.push(review);
    await review.save();
    await puesto.save();
    req.flash('success', 'Reseña publicada correctamente');
    res.redirect(`/puestos/${puesto._id}`);
}

module.exports.deleteReview = async(req, res) =>{
    const {id, reviewId} = req.params;
    await Puestos.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Reseña eliminada correctamente');
    res.redirect(`/puestos/${id}`);
}