const express = require('express');
const router = express.Router();
const AsyncErrors = require('../AsyncErrors');
const puestosIndex = require('../controllers/puestos');
const {isLoggedIn, isAuthor, validaTacos} = require('../middleware');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({ storage });
 
router.route('/')
    .get(AsyncErrors(puestosIndex.index))
    .post(isLoggedIn, upload.array('image'), validaTacos, AsyncErrors(puestosIndex.createPuesto));
    
    
router.get('/new', isLoggedIn, puestosIndex.renderNewForm);
router.route('/:id')
    .get(AsyncErrors(puestosIndex.showPage))
    .put(isLoggedIn, isAuthor, upload.array('image'),validaTacos, AsyncErrors(puestosIndex.updatePuesto))
    .delete(isLoggedIn, isAuthor, AsyncErrors(puestosIndex.deletePuesto));


router.get('/:id/edit', isLoggedIn, isAuthor, AsyncErrors(puestosIndex.editPuestoForm));

module.exports = router;
