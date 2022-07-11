const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

module.exports.register = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      } else {
        req.flash("success", `Hello, ${username}! Welcome to Yelp Camp!`);
        res.redirect("/campgrounds");
      }
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

let redirectUrl;

module.exports.renderLogin = (req, res) => {
  redirectUrl = req.session.returnTo;
  res.render("users/login");
};

module.exports.login = (req, res) => {
  req.flash(
    "success",
    `Hello, ${req.body.username}! Welcome back to CampAmaze!`
  );
  delete req.session.returnTo;
  if (!redirectUrl) {
    return res.redirect("/campgrounds");
  }
  res.redirect(redirectUrl);
};

module.exports.logout = async (req, res) => {
  req.logout((e) => {
    if (e) {
      return next(e);
    } else {
      req.flash("success", "Logged you out");
      res.redirect("/campgrounds");
    }
  });
};
