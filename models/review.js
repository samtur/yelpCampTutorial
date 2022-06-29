// Requires
const mongoose = require('mongoose');
// Shorten Schema syntax.
const Schema = mongoose.Schema;
// review model
const reviewSchema = new Schema({
    body: String,
    rating: Number
})
// export model
module.exports = mongoose.model("Review", reviewSchema)