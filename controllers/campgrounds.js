const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
  //use geocoding to get data of the place
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  //geometry returns geoJSON
  //   res.send(geoData.body.features[0].geometry.coordinates);
  //add all the images
  const newObj = new Campground(req.body.campground);
  try {
    newObj.geometry = geoData.body.features[0].geometry; //adding in the geoJSON
  } catch (e) {
    next(e);
  }
  newObj.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  newObj.author = req.user._id;
  await newObj.save();
  req.flash("success", "Campground created successfully");
  res.redirect(`/campgrounds/${newObj.id}`);
};

module.exports.showCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author", //nested populate(populate author with reviews)
      },
    })
    .populate("author");
  if (!campground) {
    req.flash("error", "Campground not found");
    res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const curr = await Campground.findById(id);
  if (!curr) {
    req.flash("error", "Campground not found");
    res.redirect("/campgrounds");
  }
  //   console.log(curr);
  res.render("campgrounds/edit", { curr });
};

module.exports.updateCampground = async (req, res, next) => {
  //add all the images to new object also
  const { id } = req.params;
  const curr = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const img = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  curr.images.push(...img);
  await curr.save();
  //   console.log("hehe", req.body.deleteImages);
  //   res.send("wait");
  if (req.body.campground && req.body.deleteImages) {
    //delete the images from cloudinary too
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    //pull out all the images having
    //filename as in deleteImages
    //mongoose command
    await curr.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Successfully updated campground");
  res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted campground");
  res.redirect(`/campgrounds`);
};
