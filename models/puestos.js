const mongoose = require('mongoose');
const {Schema} = mongoose;
const Tacos = require('./tacos')

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

PuestosSchema.pre('findOneAndDelete', async function(puesto){
    if (puesto.tacos.length) {
       // const res = 
       await Tacos.deleteMany({_id: {$in: puesto.tacos}});
       // console.log(res)
        
    }
});

module.exports = mongoose.model('Puestos', PuestosSchema);
