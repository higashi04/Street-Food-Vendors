const express = require('express');
const router = express.Router({mergeParams: true});
const AsyncErrors = require('../AsyncErrors');
const AppError = require('../AppError');
const { TacosSchema} = require('../validaTacos');
const Tacos = require('../models/tacos');
const Puestos = require('../models/puestos');

const validaTacos = (req, res, next) => { 
    const { error } = PuestosSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el => el.message).join(',')
        throw new AppError(msg, 400)
    } else {
        next();}
}


router.get('/new', AsyncErrors(async(req, res) => {
    const { id } = req.params;
    const puesto = await Puestos.findById(id);
    res.render('newTacos/new', { id, puesto });
}));
router.post('/', AsyncErrors(async(req, res) => {
    const { id } = req.params;
    const puesto = await Puestos.findById(id);
    const { title, descripción, image, precio } = req.body
    const tacos = new Tacos({ title, descripción, image, precio });
    puesto.tacos.push(tacos);
    tacos.puesto = puesto;
    await puesto.save();
    await tacos.save();
    req.flash('success', 'Artículo añadido correctamente');
    res.redirect(`/puestos/${puesto._id}`)
}));
router.delete('/:tacoId', AsyncErrors(async(req, res) =>{
    const {id, tacoId} = req.params;
    await Puestos.findByIdAndUpdate(id, {$pull: {tacos: tacoId}});
    await Tacos.findByIdAndDelete(tacoId);
    req.flash('success', 'Artículo eliminado correctamente');
    res.redirect(`/puestos/${id}`);
}));

module.exports = router;