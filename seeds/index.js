
// Require model, remember to use .. syntax to access the models directory
const Campground = require('../models/campgrounds');
// Require mongoose and connect.
const mongoose = require('mongoose');
// Require cities seed data.
const cities = require('./cities')
// Require places, descriptors arrays from ./seedhelpers
const { places, descriptors } = require('./seedhelpers')
mongoose.connect('mongodb://localhost:27017/yelp-camp');
// Logic to check for errors on db connection.
// db variable shortens syntax.
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('database connected!')
});

// This function pulls a random value from our array.
const sample = array => array[Math.floor(Math.random() * array.length)];

//We are adding seed data.
// Use a for loop to generate a randome number and pull from cities.js.
// title: takes random descriptor and places and puts together
const seedDB = async () => {
    await Campground.deleteMany();
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 30) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa accusamus provident distinctio illum beatae aut non, fugiat, veniam tempora commodi sunt impedit recusandae dolore, vero autem ipsa deserunt? Tenetur, sapiente.",
            price
        })
        await camp.save();
    }
}

// This runs our function.
// And closes our connection.
seedDB().then(() => {
    mongoose.connection.close();
});