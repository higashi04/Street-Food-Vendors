const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const AsyncErrors = require('../AsyncErrors')

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', AsyncErrors(async(req, res) =>{
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
    
}));

router.get('/login', (req, res) => {
    res.render('users/login')
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) =>{
    req.flash('success', 'Bienvenido de vuelta');
    const redirectUrl = req.session.returnTo || '/puestos';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

router.get('/logout', (req, res)=>{
    req.logout();
    req.flash('success', '¡Hasta la próxima!')
    res.redirect('/puestos');
})

module.exports = router;