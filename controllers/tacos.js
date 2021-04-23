const Tacos = require('../models/tacos');
const Puestos = require('../models/puestos');

module.exports.renderNewTacosForm = async(req, res) => {
    const { id } = req.params;
    const puesto = await Puestos.findById(id);
    res.render('newTacos/new', { id, puesto });
}
module.exports.addTacos = async(req, res) => {
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
}
module.exports.deleteTacos = async(req, res) =>{
    const {id, tacoId} = req.params;
    await Puestos.findByIdAndUpdate(id, {$pull: {tacos: tacoId}});
    await Tacos.findByIdAndDelete(tacoId);
    req.flash('success', 'Artículo eliminado correctamente');
    res.redirect(`/puestos/${id}`);
}