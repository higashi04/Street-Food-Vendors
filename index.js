const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const path = require('path');
const Puestos = require('./models/puestos');
const AppError = require('./AppError');
const AsyncErrors = require('./AsyncErrors');
const { PuestosSchema } = require('./validaTacos');
const Tacos = require('./models/tacos');
const { TacosSchema } = require('./validaTacos')

mongoose.connect('mongodb://localhost:27017/puestosdetacos', {
    useNewUrlParser: true,
    useCreateIndex: true, 
    useUnifiedTopology: true});


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database Connected, bro')
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.engine('ejs', engine)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

const validaTacos = (req, res, next) => { 
    const { error } = PuestosSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el => el.message).join(',')
        throw new AppError(msg, 400)
    } else {
        next();}
}


app.get('/puestos', AsyncErrors(async(req, res) =>{
    const puestos = await Puestos.find({});
    res.render('puestos/index', { puestos })
}));

app.post('/puestos', validaTacos, AsyncErrors(async (req, res, next) =>{
        const puesto = new Puestos(req.body.Puesto);
        await puesto.save();
        res.redirect(`/puestos/${puesto._id}`)    
})); 

app.get('/puestos/new', (req, res) =>{
    res.render('puestos/nuevo.ejs');
});
app.get('/puestos/:id', AsyncErrors(async (req, res) =>{
    const puesto = await Puestos.findById(req.params.id).populate('tacos');
    console.log(puesto);   
    res.render('puestos/show', { puesto });
}));

app.get('/puestos/:id/edit', AsyncErrors(async(req, res) =>{
    const puesto = await Puestos.findById(req.params.id);
     res.render('puestos/edit', { puesto });
}));

app.put('/puestos/:id', validaTacos, AsyncErrors(async(req, res) =>{
    const { id } = req.params;
    const puesto = await Puestos.findByIdAndUpdate(id, {...req.body.Puesto})
    res.redirect(`/puestos/${puesto._id}`);
}));

app.delete('/puestos/:id', AsyncErrors(async(req, res) => {
    const { id } = req.params;
    await Puestos.findByIdAndDelete(id);
    res.redirect('/puestos')
}));

//////////////new Tacos routes///////////////////////////////////////////////////////
app.get('/puestos/:id/newTacos/new', AsyncErrors(async(req, res) => {
    const { id } = req.params;
    const puesto = await Puestos.findById(id);
    res.render('newTacos/new', { id, puesto });
}));
app.post('/puestos/:id', AsyncErrors(async(req, res) => {
    const { id } = req.params;
    const puesto = await Puestos.findById(id);
    const { title, descripción, image, precio } = req.body
    const tacos = new Tacos({ title, descripción, image, precio });
    puesto.tacos.push(tacos);
    tacos.puesto = puesto;
    await puesto.save();
    await tacos.save();
    console.log(puesto);
    res.redirect(`/puestos/${puesto._id}`)
}))
///////////////////////////////////////////////////////////////////////////////////

app.all('*', (req, res, next) => {
    next(new AppError('Sitio No Existe', 404))
});

app.use((err, req, res, next) => {
    const { status = 500} = err;
    if (!err.message) err.message = 'vos la habeis cajeteado'
    res.status(status).render('error', { err })
   
});


app.listen(3000, ()=> {
    console.log("they listening to us!! on port three thousand minus seven!!!!")
});