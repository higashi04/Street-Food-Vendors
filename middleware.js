module.exports.isLoggedIn = (req, res, next) =>{
    if (!req.isAuthenticated()) {
        req.flash('error', 'entra a tu cuenta por favor');
        return res.redirect('/login');
    }
    next();
}


