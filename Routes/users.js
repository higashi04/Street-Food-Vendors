const express = require('express');
const router = express.Router();
const passport = require('passport');
const AsyncErrors = require('../AsyncErrors')
const usersController = require('../controllers/users')

router.route('/register')
    .get(usersController.registerForm)
    .post(AsyncErrors(usersController.createUser));

router.route('/login')
    .get(usersController.loginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), usersController.loginUser);


router.get('/logout', usersController.logoutUser)

module.exports = router;