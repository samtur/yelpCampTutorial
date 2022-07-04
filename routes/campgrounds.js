const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const expressError = require('../utils/expressError');
const Campground = require('../models/campgrounds');
const { campgroundSchema } = require('../schemas.js')

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

// A route to show all campgrounds.
// .find() campground from db.
// res.render to access model, and pass it our campgrounds data.
// Use wrapAsync function to looking for errors this is quicker,
// than writing multiple try and catch statements.
router.get('/', wrapAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))

// This is our new route
router.get('/new', (req, res) => {
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
router.post('/', validateCampground, wrapAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}))



// This is our show route
// We can find our campground by id and save as campground.
// This is then pass through so we can access in our templates.
router.get('/:id', wrapAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if (!campground) {
        req.flash('error', 'Cannot find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground });
}))

// This is our edit route.
// We await findById() save as campground
// res.render template and campground
router.get('/:id/edit', wrapAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground });
}))

// Our put route for editing.
// Destructure our id so it can be accessed.
// Use .findByIdAndUpdate() pass in id and changes.
// For changes we can use the spread operator ...
// This will spread our req.body.campground into the object,
// Finally we redirect back to our show page
router.put('/:id', validateCampground, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${campground._id}`);
}));

// The delete route.
// Uses app.delete can also use app.put/
// Destructure id, because we need it!
// We use a findByIdAndDelete() method for now, this will change later.
// res.redirect back to our index page.
router.delete('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'You successfully deleted a campground!')
    res.redirect('/campgrounds');
}))

module.exports = router;