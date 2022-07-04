// REQUIRMENTS AND CONNECTIONS
// Here we are requiring express and path.
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
// Requiring ejs-mate
const ejsMate = require('ejs-mate');
// require session
const session = require('express-session')
const flash = require('connect-flash')
// Requiring function from other file.
const expressError = require('./utils/expressError')
// Require model.
const methodOverride = require('method-override');

const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews')

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
// Serving static assets
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'thisisasecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
    }
}
app.use(session(sessionConfig))

app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next()
})

app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)


// SITE ROUTES
// Here we are creating a basic route to test.
// We render our home to test our home.ejs
app.get('/', (req, res) => {
    res.render('home');
})


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