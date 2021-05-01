const JOI = require('joi')
module.exports.PuestosSchema = JOI.object({
    Puesto: JOI.object({
        title: JOI.string().required(),
        calle: JOI.string().required(),
       // image: JOI.string().required(),
        descripción: JOI.string().required(),
    }).required()
});

module.exports.TacosSchema = JOI.object({
    Taco: JOI.object({
        title: JOI.string().required(),
        descripción: JOI.string().required(),
        image: JOI.string().required(),
        price: JOI.number().required().min(0)
    }).required()
});

module.exports.reviewSchema = JOI.object({
    review: JOI.object({
        rating: JOI.number().required().min(1).max(5),
        body: JOI.string().required()
    }).required()
})
