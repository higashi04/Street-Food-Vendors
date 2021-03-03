const express = require('express');
const app = express();
const mongoose = require('mongoose');
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
})

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/makepuestos', async (req, res) => {
    const puesto = new Puestos({title: 'tacos 5 x 20'});
    await puesto.save();
    res.send(puesto);

})

app.listen(3000, ()=> {
    console.log("they listening to us!! on port three thousand minus seven!!!!")
})