const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PuestosSchema = new Schema({
    title: String,
    calle: String,
    descripción: String
});

module.exports = mongoose.model('Puestos', PuestosSchema);
