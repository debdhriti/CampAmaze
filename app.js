//invoke dotenv when in development mode
if (process.env.NODE_ENV !== "production") {
  //goes in here only when in development mode
  require("dotenv").config();
}
//imports start
const express = require("express");
const app = express();
const ejsMate = require("ejs-mate");
const path = require("path");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const campgroundsRoutes = require("./routes/campgrounds");
const reviewsRoutes = require("./routes/reviews");
const userRoutes = require("./routes/user");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const mongoSanitize = require("express-mongo-sanitize");
const MongoDBStore = require("connect-mongo");
//imports end

//db url for atlas
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";
//"mongodb://localhost:27017/yelp-camp"
//connect with mongoose
mongoose //promise support exists ---> hence error handling
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongoose is connected");
  })
  .catch((err) => {
    console.log("Mongoose connection error: ", err);
  });

app.engine("ejs", ejsMate); //engine used to parse ejs
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

//app.use() are the middlewares
//for parsing application forms
app.use(express.urlencoded({ extended: true }));

//for allowing method-override so that PATCH and DELETE work
app.use(methodOverride("_method"));

//add the folder under which css and js are present
app.use(express.static(path.join(__dirname, "/public")));

//environment variable
const secret = process.env.SECRET || "thisshouldbeabettersecret";

const store = MongoDBStore.create({
  mongoUrl: dbUrl,
  secret,
  touchAfter: 24 * 60 * 60,
});

store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});

//use middleware to setup session
const sessionConfig = {
  store,
  name: "sessionCookie",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //expire date
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

//using middleware to setup flash
app.use(flash());

//middlewares for using passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

//EXPRESS-MONGO-SANITIZE package is used to
//prevent user form using $ or ... to exclude
//any security breach(else it could evaluate to mongo command)
app.use(mongoSanitize());

//serialize and deserialize users
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware to use flash at all places together
app.use((req, res, next) => {
  // console.log(req.session);
  res.locals.currentUser = req.user; //current user(passed to all ejs)
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//middleware accessing all routers
app.use("/", userRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/reviews", reviewsRoutes);

//homepage
app.get("/", (req, res) => {
  res.render("home");
});
//template header ends

// app.get("/fakeUser", async (req, res) => {
//   const user = new User({ email: "something@gmail.com", username: "LELOLULU" });
//   const newUser = await User.register(user, "chicken"); //registers the new user
//   res.send(newUser);
// });

//template footer from here
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not found", 404));
});

//sink error middleware for all ExpressErrors nexted before
app.use((err, req, res, next) => {
  const { status = 500, message = "Default error message", stack } = err;
  res.status(status).render("error", { status, message, stack });
  //   res.send("AINTYA FAMAKKED?!!");
});

//environment variable port
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
