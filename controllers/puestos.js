const Puestos = require('../models/puestos');
const {cloudinary} = require('../cloudinary')


module.exports.index = async(req, res) =>{
    const puestos = await Puestos.find({});
    res.render('puestos/index', { puestos })
};

module.exports.renderNewForm = (req, res) =>{
    res.render('puestos/nuevo.ejs');
};

module.exports.createPuesto = async (req, res, next) =>{
    const puesto = new Puestos(req.body.Puesto);
    puesto.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    puesto.author = req.user._id;
    await puesto.save();
    console.log(puesto);
    req.flash('success', 'Puesto registrado correctamente');
    res.redirect(`/puestos/${puesto._id}`)    
};

module.exports.showPage = async (req, res) =>{
    const puesto = await Puestos.findById(req.params.id).populate('tacos').populate({
        path: 'reviews',
            populate: {
                path: 'author'
            }         
    }).populate('author');  
    if (!puesto){
        req.flash('error', 'No es posible encontrar tu puesto');
        return res.redirect('/puestos')
    }
    res.render('puestos/show', { puesto });
};

module.exports.editPuestoForm = async(req, res) =>{
    const { id } = req.params;
    const puesto = await Puestos.findById(id)
    if (!puesto){
        req.flash('error', 'No es posible encontrar tu puesto');
        return res.redirect('/puestos')
    }
     res.render('puestos/edit', { puesto });
};

module.exports.updatePuesto = async(req, res) =>{
    const { id } = req.params;
    const puesto = await Puestos.findByIdAndUpdate(id, {...req.body.Puesto});
    req.flash('success', 'Puesto actualizado correctamente');
    res.redirect(`/puestos/${puesto._id}`);
};

module.exports.deletePuesto = async(req, res) => {
    const { id } = req.params;
    await Puestos.findByIdAndDelete(id);
    req.flash('success', 'Puesto eliminado correctamente');
    res.redirect('/puestos');
}

