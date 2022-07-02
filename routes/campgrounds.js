const express = require("express");
//mergeParams so that the params passed with argument
//can also be retrieved
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const campgrounds = require("../controllers/campgrounds");
const { campgroundSchema } = require("../schemas");
const Campground = require("../models/campground");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
//imports done
//campground shit

router
  .route("/")
  .get(catchAsync(campgrounds.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.createCampground)
  );

//creating a new campground
//step1: get request to make the form page
router.get("/new", isLoggedIn, campgrounds.renderNewForm);
//step2: handle the post request

router
  .route("/:id")
  .get(catchAsync(campgrounds.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

//editing a campground
//step1: get updated data from the form
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);
//step2: handle the put request

//show specific campgrounds

//delete a campground

module.exports = router;
