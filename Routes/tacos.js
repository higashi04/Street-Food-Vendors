const express = require('express');
const router = express.Router({mergeParams: true});
const AsyncErrors = require('../AsyncErrors');
const {isLoggedIn, isAuthor } = require('../middleware')
const tacosController = require('../controllers/tacos')

router.get('/new', isLoggedIn, isAuthor, AsyncErrors(tacosController.renderNewTacosForm));
router.post('/', isLoggedIn, isAuthor, AsyncErrors(tacosController.addTacos));
router.delete('/:tacoId', isLoggedIn, isAuthor, AsyncErrors(tacosController.deleteTacos));

module.exports = router;