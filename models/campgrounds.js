// Require mongoose.
const mongoose = require('mongoose');
// Varibable to shorten syntax.
const Schema = mongoose.Schema;
const Review = require('./review')

// Our schema.
const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews,
            }
        })
    }
})

// Exporting our model.
module.exports = mongoose.model('Campground', CampgroundSchema)