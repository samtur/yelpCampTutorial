// Require mongoose.
const mongoose = require('mongoose');
// Varibable to shorten syntax.
const Schema = mongoose.Schema;

// Our schema.
const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

// Exporting our model.
module.exports = mongoose.model('Campground', CampgroundSchema)