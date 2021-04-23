const User = require('../models/user');

module.exports.registerForm = (req, res) => {
    res.render('users/register');
}

module.exports.createUser = async(req, res) =>{
    try {
    const {email, username, password} = req.body;
    const user = new User({email, username});
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
        if(err) {
            return next(err);
        }
        req.flash('success', 'Bienvenid@ a TacoMaps!');
        res.redirect('/puestos');
    })
    
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
    
};

module.exports.loginForm = (req, res) => {
    res.render('users/login')
}

module.exports.loginUser = (req, res) =>{
    req.flash('success', 'Bienvenido de vuelta');
    const redirectUrl = req.session.returnTo || '/puestos';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res)=>{
    req.logout();
    req.flash('success', '¡Hasta la próxima!')
    res.redirect('/puestos');
}