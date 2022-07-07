// REQUIRES
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// SCHEMA
const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})
// EXPORTING SCHEMA
module.exports = mongoose.model("Review", reviewSchema)