const express = require('express');
const router = express.Router();
const AsyncErrors = require('../AsyncErrors');
const AppError = require('../AppError');
const { PuestosSchema} = require('../validaTacos');
const Puestos = require('../models/puestos');
const {isLoggedIn} = require('../middleware');

const validaTacos = (req, res, next) => { 
    const { error } = PuestosSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el => el.message).join(',')
        throw new AppError(msg, 400)
    } else {
        next();}
}


router.get('/', AsyncErrors(async(req, res) =>{
    const puestos = await Puestos.find({});
    res.render('puestos/index', { puestos })
}));

router.post('/', isLoggedIn, validaTacos, AsyncErrors(async (req, res, next) =>{
        const puesto = new Puestos(req.body.Puesto);
        puesto.author = req.user._id;
        await puesto.save();
        req.flash('success', 'Puesto registrado correctamente');
        res.redirect(`/puestos/${puesto._id}`)    
})); 

router.get('/new', isLoggedIn, (req, res) =>{
    res.render('puestos/nuevo.ejs');
});
router.get('/:id', AsyncErrors(async (req, res) =>{
    const puesto = await Puestos.findById(req.params.id).populate('tacos').populate('reviews').populate('author');  
    if (!puesto){
        req.flash('error', 'No es posible encontrar tu puesto');
        return res.redirect('/puestos')
    }
    res.render('puestos/show', { puesto });
}));

router.get('/:id/edit', isLoggedIn, AsyncErrors(async(req, res) =>{
    const puesto = await Puestos.findById(req.params.id);
    if (!puesto){
        req.flash('error', 'No es posible encontrar tu puesto');
        return res.redirect('/puestos')
    }
     res.render('puestos/edit', { puesto });
}));

router.put('/:id', isLoggedIn, validaTacos, AsyncErrors(async(req, res) =>{
    const { id } = req.params;
    const puesto = await Puestos.findByIdAndUpdate(id, {...req.body.Puesto});
    req.flash('success', 'Puesto actualizado correctamente');
    res.redirect(`/puestos/${puesto._id}`);
}));

router.delete('/:id', isLoggedIn, AsyncErrors(async(req, res) => {
    const { id } = req.params;
    await Puestos.findByIdAndDelete(id);
    req.flash('success', 'Puesto eliminado correctamente');
    res.redirect('/puestos');
}));

module.exports = router;
