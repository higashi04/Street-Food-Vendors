const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
const Puestos = require('./models/puestos')

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

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.get('/puestos', async (req, res) =>{
    const puestos = await Puestos.find({});
    res.render('puestos/index', { puestos })
});


app.post('/puestos', async (req, res) =>{
   const puesto = new Puestos(req.body);
   await puesto.save();
   res.redirect(`/puestos/${puesto._id}`)
});

app.get('/puestos/new', (req, res) =>{
    res.render('puestos/nuevo.ejs');
});
app.get('/puestos/:id', async (req, res) =>{
    const puesto = await Puestos.findById(req.params.id);   
    res.render('puestos/show', { puesto });
});

app.get('/puestos/:id/edit', async(req, res) =>{
    const puesto = await Puestos.findById(req.params.id);
     res.render('puestos/edit', { puesto });
});

app.put('/puestos/:id', async(req, res) =>{
    const { id } = req.params;
    const puesto = await Puestos.findByIdAndUpdate(id, {...req.body})
    res.redirect(`/puestos/${puesto._id}`);
});

app.delete('/puestos/:id', async(req, res) => {
    const { id } = req.params;
    await Puestos.findByIdAndDelete(id);
    res.redirect('/puestos')
} )

app.listen(3000, ()=> {
    console.log("they listening to us!! on port three thousand minus seven!!!!")
})