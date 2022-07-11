
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
            author: '62c67faaa4eb2e6b9eced0c9',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa accusamus provident distinctio illum beatae aut non, fugiat, veniam tempora commodi sunt impedit recusandae dolore, vero autem ipsa deserunt? Tenetur, sapiente.",
            price,
            images: [
                {
                    url: 'https://res.cloudinary.com/denecgcsf/image/upload/v1657525642/YelpCamp/whhhevcrqmditbe7mabr.jpg',
                    filename: 'YelpCamp/whhhevcrqmditbe7mabr',
                },
                {
                    url: 'https://res.cloudinary.com/denecgcsf/image/upload/v1657525644/YelpCamp/lglcq0ucwghjlr7gmf0n.jpg',
                    filename: 'YelpCamp/lglcq0ucwghjlr7gmf0n',
                },
                {
                    url: 'https://res.cloudinary.com/denecgcsf/image/upload/v1657357521/YelpCamp/unrx2kmphoua0zrqwfst.jpg',
                    filename: 'YelpCamp/unrx2kmphoua0zrqwfst',
                }
            ]

        })
        await camp.save();
    }
}

// This runs our function.
// And closes our connection.
seedDB().then(() => {
    mongoose.connection.close();
});