const mongoose = require("mongoose");
const Review = require("./review");
const User = require("./user");

const ImageSchema = new mongoose.Schema({
  url: String,
  filename: String,
});

//making a virtual that returns thumbnail(NOT STORED IN DB)
ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const CampgroundSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    images: [ImageSchema],
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    price: {
      type: Number,
    },
    description: {
      type: String,
    },
    location: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true, //to include the virtual when it's converted to JSON
    },
  }
);

//making a virtual to group data into needed structure
//defined by MapBox for showing
//POPUPS on CLUSTER_MAP
CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
  return `<strong><a href="/campgrounds/${this.id}">${this.title}</a></strong>
  <p>${this.description.substring(0, 30)}...</p>`;
});

//MONGOOSE MIDDLEWARE(Delete all reviews after camp is deleted)
//runs pre or post a function
//in this case: before ${Campground.findByIdAndDelete()}
//this post means after the function it is run
CampgroundSchema.post("findOneAndDelete", async (data) => {
  if (data) {
    await Review.deleteMany({
      _id: {
        $in: data.reviews, //use id only not to remove undesired things
      },
    });
  }
});

//allow exporting of the model
module.exports = mongoose.model("Campground", CampgroundSchema);
