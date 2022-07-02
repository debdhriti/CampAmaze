const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user");
const { reviewSchema } = require("../schemas");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const ExpressError = require("../utils/ExpressError");
const users = require("../controllers/users");

router
  .route("/register")
  .get(users.renderRegister)
  .post(catchAsync(users.register));

router
  .route("/login")
  .get(users.renderLogin)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.login
  );
//render the registration form

//handle the post request for registration

//render the login page

//handle the post request of login using password middleware function

router.get("/logout", catchAsync(users.logout));

module.exports = router;
