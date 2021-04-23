const { PuestosSchema, reviewSchema} = require('./validaTacos');
const Puestos = require('./models/puestos');
const AppError = require('./AppError');
const Review = require('./models/reviews');

module.exports.isLoggedIn = (req, res, next) =>{
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'entra a tu cuenta por favor');
        return res.redirect('/login');
    }
    next();
};

module.exports.validaTacos = (req, res, next) => { 
    const { error } = PuestosSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el => el.message).join(',')
        throw new AppError(msg, 400)
    } else {
        next();}
};

module.exports.isAuthor =  async (req, res, next) =>{
    const { id } = req.params;
    const puesto = await Puestos.findById(id);
    if (!puesto.author.equals(req.user._id)) {
        req.flash('error', 'No tienes autorización para eso')
        return res.redirect(`/puestos/${id}`)
            }
            next();
};


module.exports.validateReview = (req, res, next) =>{
    const {error} = reviewSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el => el.message).join(',')
        throw new AppError(msg, 400)
    } else {
        next();}
};

module.exports.isReviewAuthor =  async (req, res, next) =>{
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'No tienes autorización para eso')
        return res.redirect(`/puestos/${id}`)
            }
            next();
};