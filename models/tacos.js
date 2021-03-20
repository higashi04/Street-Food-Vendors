const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TacosSchema = new Schema({
    title: String,
    image: String,
    descripción: String,
    precio: Number,
    puesto: {
        type: Schema.Types.ObjectId,
        ref: 'Puestos'
    }
});

module.exports = mongoose.model('Tacos', TacosSchema);