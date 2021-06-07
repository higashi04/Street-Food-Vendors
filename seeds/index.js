
const mongoose = require('mongoose');
const Puestos = require('../models/puestos');
const taqueria = require('./taquerias');
const calles = require('./calles')
const descripciones = require('./descripciones');

mongoose.connect('mongodb://localhost:27017/puestosdetacos', {
    useNewUrlParser: true,
    useCreateIndex: true, 
    useUnifiedTopology: true});


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database Connected, bro')
})

const seedDB = async () =>{
    await Puestos.deleteMany({});
    for (let i = 0; i<34; i++){
        const rand34 = Math.floor(Math.random() * 34);
        const puesto = new Puestos({
            title: `${taqueria[rand34]}`,
            calle: `${calles[rand34]}`,
            descripción: `${descripciones[rand34]}`,
            images: [
                {
                  url: 'https://res.cloudinary.com/dzrldsohe/image/upload/v1620506664/streetFood/nfcnbdounyip6q5mhsub.jpg',
                  filename: 'streetFood/nfcnbdounyip6q5mhsub'
                },
                {
                  url: 'https://res.cloudinary.com/dzrldsohe/image/upload/v1620506665/streetFood/nqflifxkzlhnlbgka5s4.jpg',
                  filename: 'streetFood/nqflifxkzlhnlbgka5s4'
                }
              ],
            author: '6096f8e7729a0b2b10161f34'

        })
        await puesto.save();

    }
}

seedDB();