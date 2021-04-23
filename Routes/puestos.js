const express = require('express');
const router = express.Router();
const AsyncErrors = require('../AsyncErrors');
const puestosIndex = require('../controllers/puestos');
const {isLoggedIn, isAuthor, validaTacos} = require('../middleware');
 
router.route('/')
    .get(AsyncErrors(puestosIndex.index))
    .post(isLoggedIn, validaTacos, AsyncErrors(puestosIndex.createPuesto));

router.get('/new', isLoggedIn, puestosIndex.renderNewForm);
router.route('/:id')
    .get(AsyncErrors(puestosIndex.showPage))
    .put(isLoggedIn, isAuthor, validaTacos, AsyncErrors(puestosIndex.updatePuesto))
    .delete(isLoggedIn, isAuthor, AsyncErrors(puestosIndex.deletePuesto));


router.get('/:id/edit', isLoggedIn, isAuthor, AsyncErrors(puestosIndex.editPuestoForm));

module.exports = router;
