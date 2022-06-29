// Require joi.
const Joi = require('joi');
// if (!req.body.campground) throw new expressError('Invalid Data', 400);
// Schema to validate data using joi
// export the campgroundSchema
module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required(),
    }).required()
});
