const express = require('express');
const router = express.Router();
const AsyncErrors = require('../AsyncErrors');
const AppError = require('../AppError');
const { PuestosSchema} = require('../validaTacos');
const Puestos = require('../models/puestos');

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

router.post('/', validaTacos, AsyncErrors(async (req, res, next) =>{
        const puesto = new Puestos(req.body.Puesto);
        await puesto.save();
        req.flash('success', 'Puesto registrado correctamente');
        res.redirect(`/puestos/${puesto._id}`)    
})); 

router.get('/new', (req, res) =>{
    res.render('puestos/nuevo.ejs');
});
router.get('/:id', AsyncErrors(async (req, res) =>{
    const puesto = await Puestos.findById(req.params.id).populate('tacos').populate('reviews');  
    if (!puesto){
        req.flash('error', 'No es posible encontrar tu puesto');
        return res.redirect('/puestos')
    }
    res.render('puestos/show', { puesto });
}));

router.get('/:id/edit', AsyncErrors(async(req, res) =>{
    const puesto = await Puestos.findById(req.params.id);
    if (!puesto){
        req.flash('error', 'No es posible encontrar tu puesto');
        return res.redirect('/puestos')
    }
     res.render('puestos/edit', { puesto });
}));

router.put('/:id', validaTacos, AsyncErrors(async(req, res) =>{
    const { id } = req.params;
    const puesto = await Puestos.findByIdAndUpdate(id, {...req.body.Puesto});
    req.flash('success', 'Puesto actualizado correctamente');
    res.redirect(`/puestos/${puesto._id}`);
}));

router.delete('/:id', AsyncErrors(async(req, res) => {
    const { id } = req.params;
    await Puestos.findByIdAndDelete(id);
    req.flash('success', 'Puesto eliminado correctamente');
    res.redirect('/puestos');
}));

module.exports = router;
