const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const { reviewSchema } = require("../schemas");
const Campground = require("../models/campground");
const Review = require("../models/review");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const reviews = require("../controllers/reviews");

//server side validations done

//all reviews of the campground
router.post("/", validateReview, isLoggedIn, catchAsync(reviews.createReview));

//delete a review
//delete the review from campground as well as
//the database
router.delete(
  "/:reviewID",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(async (req, res) => {
    const { id, reviewID } = req.params;
    //pull operator in mongo
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
    await Review.findByIdAndDelete(reviewID); //this calls the mongoose post middleware
    // res.send("DELTEEEEEEEEE");
    req.flash("success", "Successfully deleted review");
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
