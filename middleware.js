const Campground = require("./models/campground");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");
const { campgroundSchema, reviewSchema } = require("./schemas");
//middleware for necessary login
module.exports.isLoggedIn = (req, res, next) => {
  //user must be authenticated to make new campgrounds
  if (!req.isAuthenticated()) {
    //store the url they are requesting
    //go back to it after logging in
    req.session.returnTo = req.originalUrl;
    // console.log("RDURL: ", req.session.returnTo);
    req.flash("error", "You must be signed in!");
    return res.redirect("/login");
  }
  next();
};

//to validate the req.body coming in
//using joi package
module.exports.validateCampground = (req, res, next) => {
  // if (!req.body.campground)
  //   throw new ExpressError("Invalid Campground", 400);
  //make a joi schema for handling mongoose sheme validations
  //IMPORTED FORM SHCEMAS.JS
  //pass the object to the schema and print the result
  const { error } = campgroundSchema.validate(req.body);
  // console.log(result);
  if (error) {
    const msg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    //just go to next thing in order
    next();
  }
  //error handling via joi done
};

//middleware to handle authoRIZATION
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!req.user || !campground.author.equals(req.user._id)) {
    req.flash("error", "Permission Denied");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

//similarly a middleware function to validate reviews
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    //just go to next thing in order
    next();
  }
};

//middleware to handle authoRIZATION of review
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewID } = req.params;
  const review = await Review.findById(reviewID);
  if (!req.user || !review.author.equals(req.user._id)) {
    req.flash("error", "Permission Denied");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};
