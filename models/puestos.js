const mongoose = require('mongoose');
const {Schema} = mongoose;

const PuestosSchema = new Schema({
    title: {
        type: String,
        required: [true, 'nombra tu puesto por favor']
    },
    calle: {
        type: String,
        required: [true, 'necesitas decirme donde están tus tacos']
        },
    image: String,
    descripción: String,
    tacos: [{
        type: Schema.Types.ObjectId,
        ref: 'Tacos'
    }]
});

module.exports = mongoose.model('Puestos', PuestosSchema);
