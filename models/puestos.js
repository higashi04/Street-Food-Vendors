const mongoose = require('mongoose');
const {Schema} = mongoose;
const Tacos = require('./tacos');
const Review = require('./reviews');

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
    }],
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

PuestosSchema.post('findOneAndDelete', async function(puesto){
    if (puesto.tacos.length) {
       await Tacos.deleteMany({_id: {$in: puesto.tacos}});
       
        
    }
});

PuestosSchema.post('findOneAndDelete', async function(puesto){
    if (puesto.reviews.length) {
       await Review.deleteMany({_id: {$in: puesto.reviews}});
       
        
    }
});

module.exports = mongoose.model('Puestos', PuestosSchema);
