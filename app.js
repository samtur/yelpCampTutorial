// REQUIRMENTS AND CONNECTIONS
// Here we are requiring express and path.
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
// Requiring ejs-mate
const ejsMate = require('ejs-mate');
// Require joi schema in app.
const { campgroundSchema } = require('./schemas.js')
// Requiring function from other file.
const wrapAsync = require('./utils/wrapAsync');
const expressError = require('./utils/expressError')
// Require model.
const methodOverride = require('method-override');
const Campground = require('./models/campgrounds');
const Review = require('./models/review')
// Require method override.
// Our middleware to call Joi validations.
const validateCampground = (req, res, next) => {

    const { error } = campgroundSchema.validate(req.body);
    // This is saying if there is an error throw an error to our error handler.
    if (error) {
        // This let's us display the message correctly.
        const msg = error.details.map(el => el.message).join(',')
        throw new expressError(msg, 400)
    } else {
        next()
    }
}
// Require mongoose and connect.
mongoose.connect('mongodb://localhost:27017/yelp-camp');
// Logic to check for errors on db connection.
// db variable shortens syntax.
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('database connected!')
});
// Calling express.
const app = express();
// Using ejs-mate
app.engine('ejs', ejsMate)
// Here we are linking to our views ejs templates.
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
// Here we are allowing our req.body to be parsed so
// we can display it.
app.use(express.urlencoded({ extended: true }))
// We need to use method override.
app.use(methodOverride('_method'))


// SITE ROUTES
// Here we are creating a basic route to test.
// We render our home to test our home.ejs
app.get('/', (req, res) => {
    res.render('home');
})

// A route to show all campgrounds.
// .find() campground from db.
// res.render to access model, and pass it our campgrounds data.
// Use wrapAsync function to looking for errors this is quicker,
// than writing multiple try and catch statements.
app.get('/campgrounds', wrapAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))

// This is our new route
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

// Our post request for new campgrounds.
// Create a campground using req.body.campground
// await and save() to our db
// We use a res.redirect to go to the show page.
// WE MUST PARSE THE REQ.BODY TO MAKE IT SHOW!
// Use wrapAsync() fucntion to catch errors from our async functions.
// throw the errpr of if no req.body this will send it to app.use.
// This needs a message and 400 argument.
// Middleware for Joi validation.
app.post('/campgrounds', validateCampground, wrapAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))



// This is our show route
// We can find our campground by id and save as campground.
// This is then pass through so we can access in our templates.
app.get('/campgrounds/:id', wrapAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
}))

// This is our edit route.
// We await findById() save as campground
// res.render template and campground
app.get('/campgrounds/:id/edit', wrapAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}))

// Our put route for editing.
// Destructure our id so it can be accessed.
// Use .findByIdAndUpdate() pass in id and changes.
// For changes we can use the spread operator ...
// This will spread our req.body.campground into the object,
// Finally we redirect back to our show page
app.put('/campgrounds/:id', validateCampground, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
    res.redirect(`/campgrounds/${campground._id}`);
}));

// The delete route.
// Uses app.delete can also use app.put/
// Destructure id, because we need it!
// We use a findByIdAndDelete() method for now, this will change later.
// res.redirect back to our index page.
app.delete('/campgrounds/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

// Review post route.
app.post('/campgrounds/:id/reviews', wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

// app.all covers all requests '*' = every path.
// The covers errors for wrong urls
// This will only run if nothing has matched before.
// Respond with our class, a message and error code.
app.all('*', (req, res, next) => {
    next(new expressError('Page not found', 404))
})


// This is our error handler for our app.
// Render errors template!
// Pass entire err through render.
// Now message won't default so...
// ..if statement containing default behaviour.
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no! You have an error!';
    res.status(statusCode).render('errors', { err });
})

// Here we are listening for our server.
app.listen(3000, () => {
    console.log('Serving on port 3000');
})