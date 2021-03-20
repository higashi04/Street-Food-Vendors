const JOI = require('joi')
module.exports.PuestosSchema = JOI.object({
    Puesto: JOI.object({
        title: JOI.string().required(),
        calle: JOI.string().required(),
        image: JOI.string().required(),
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

