const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  // const { id } = req.params;
  const curr = await Campground.findById(req.params.id);
  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  curr.reviews.push(newReview);
  //save the review as well
  await newReview.save();
  await curr.save();
  req.flash("success", "Successfully created review");
  res.redirect(`/campgrounds/${curr.id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewID } = req.params;
  //pull operator in mongo
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
  await Review.findByIdAndDelete(reviewID); //this calls the mongoose post middleware
  // res.send("DELTEEEEEEEEE");
  req.flash("success", "Successfully deleted review");
  res.redirect(`/campgrounds/${id}`);
};
