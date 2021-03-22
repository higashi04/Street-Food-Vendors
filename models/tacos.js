const mongoose = require('mongoose');
const { Schema } = mongoose;

const TacosSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Nombra tus tacos por favor.']
    },
    image: String,
    descripción: String,
    precio: {
        type: Number,
        required: [true, 'apoco son gratis?']
    },
    puesto: {
        type: Schema.Types.ObjectId,
        ref: 'Puestos'
    }
});

module.exports = mongoose.model('Tacos', TacosSchema);